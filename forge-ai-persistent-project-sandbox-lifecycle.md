# Forge AI --- Persistent Projects and Ephemeral Sandbox Lifecycle

## 1. Purpose

Forge AI separates a user's **persistent project** from the **temporary
sandbox** used to develop and preview it.

A project can survive many sandbox sessions. Kubernetes pods are
disposable; the project's source files and metadata are not.

The design has three independent lifecycles:

1.  **Project lifecycle** --- permanent until the user deletes the
    project.
2.  **Sandbox lifecycle** --- temporary, extended while the user is
    active, and terminated after inactivity.
3.  **AI task lifecycle** --- an individual agent operation that must
    finish safely or be cancelled before its sandbox is removed.

This separation prevents a pod restart, eviction, timeout, or deletion
from destroying the user's application.

------------------------------------------------------------------------

## 2. Core architecture and responsibilities

  -----------------------------------------------------------------------
  Component               Responsibility          Persistence
  ----------------------- ----------------------- -----------------------
  Auth service            Authenticates the user  User/account data is
                          and establishes trusted persistent
                          identity                

  Project service /       Stores project          Persistent
  MongoDB                 ownership, name,        
                          timestamps, storage     
                          location, and current   
                          revision                

  Sandbox service         Creates, starts,        Service is persistent;
                          tracks, stops, and      individual sandboxes
                          deletes sandbox         are temporary
                          environments            

  Kubernetes              Runs sandbox, agent,    Pods are disposable
                          and development-server  
                          workloads               

  Redis                   Tracks active sandbox   Ephemeral coordination
                          leases, activity,       state; recoverable from
                          status, and expiry      durable records

  MinIO / S3              Stores project source   Persistent
                          files, manifests, and   
                          revisions               

  AI orchestration /      Reads and modifies      Work must be
  agent                   files in the active     synchronized to
                          workspace               persistent storage

  Cleanup worker          Detects expired leases  Runs independently of
                          and performs graceful   an individual sandbox
                          termination             
  -----------------------------------------------------------------------

### Key identifiers

-   `userId`: authenticated owner of the project.
-   `projectId`: stable identity of the user's application. It remains
    the same across sessions.
-   `sandboxId`: identity of one temporary running environment. A later
    session normally receives a new `sandboxId`.
-   `taskId`: identity of an AI operation, such as generating or editing
    a feature.
-   `revision`: monotonically increasing project snapshot/version
    identifier.

Do not use `sandboxId` as the permanent identity of a project. A project
can have many sandbox sessions over its lifetime.

------------------------------------------------------------------------

## 3. High-level lifecycle

``` text
User signs in
    |
    v
Fetch the user's projects
    |
    v
User selects a project (or creates one)
    |
    v
Check whether a usable sandbox already exists
    |
    +---- Yes ---> Return/reconnect to that sandbox
    |
    +---- No ----> Create a new sandbox
                       |
                       v
                 Restore project snapshot from MinIO
                       |
                       v
                 Start agent and development server
                       |
                       v
                 User and agent work in workspace
                       |
                       v
                 Track activity and renew sandbox lease
                       |
                       v
                 Sync file changes to MinIO
                       |
             User inactive / lease expires
                       |
                       v
                 Mark sandbox as terminating
                       |
                       v
                 Stop accepting new tasks
                       |
                       v
                 Finish or cancel active tasks safely
                       |
                       v
                 Flush and verify pending file changes
                       |
                       v
                 Delete Kubernetes resources
                       |
                       v
                 Mark sandbox stopped/expired
                       |
                       v
             Project remains available for next session
```

------------------------------------------------------------------------

## 4. API endpoints

The paths below are endpoint placeholders. Replace `/{...}` with the
actual route parameters and mount prefixes used by the services.

All project and sandbox endpoints must require authentication unless
explicitly identified as public. The backend must derive `userId` from
the verified session/token, not trust a user ID supplied in the request
body.

### 4.1 Authentication and projects

  ---------------------------------------------------------------------------
  Method                  Endpoint                    Description
  ----------------------- --------------------------- -----------------------
  `GET`                   `/{projects}`               Return the
                                                      authenticated user's
                                                      projects, including
                                                      project IDs and useful
                                                      summary metadata.

  `POST`                  `/{projects}`               Create a project record
                                                      and initialize its
                                                      storage
                                                      namespace/initial
                                                      snapshot.

  `GET`                   `/{projects}/{projectId}`   Return project metadata
                                                      after checking
                                                      ownership.

  `PATCH`                 `/{projects}/{projectId}`   Update project metadata
                                                      such as name or
                                                      description.

  `DELETE`                `/{projects}/{projectId}`   Delete a project and
                                                      schedule deletion of
                                                      its stored objects and
                                                      related resources
                                                      according to the
                                                      retention policy.
  ---------------------------------------------------------------------------

The project list can include `lastOpenedAt` so the frontend can suggest
the user's most recently opened project. The server should not silently
start a sandbox merely because a project is the most recent one; the
frontend can select it and call the start endpoint.

Example project metadata:

``` json
{
  "projectId": "project-456",
  "userId": "user-789",
  "name": "My React App",
  "storagePrefix": "users/user-789/projects/project-456/",
  "currentRevision": 12,
  "lastOpenedAt": "2026-11-06T14:00:00.000Z"
}
```

### 4.2 Sandbox lifecycle

  -----------------------------------------------------------------------------------------
  Method                  Endpoint                                  Description
  ----------------------- ----------------------------------------- -----------------------
  `POST`                  `/{projects}/{projectId}/sandbox/start`   Start or restore a
                                                                    sandbox for the
                                                                    selected project. Reuse
                                                                    a healthy active
                                                                    sandbox for the same
                                                                    user/project when
                                                                    appropriate.

  `GET`                   `/{sandboxes}/{sandboxId}`                Return sandbox status
                                                                    and associated project
                                                                    after ownership
                                                                    validation.

  `GET`                   `/{sandboxes}/{sandboxId}/status`         Return provisioning,
                                                                    restoring, running,
                                                                    terminating, stopped,
                                                                    or failed status.

  `POST`                  `/{sandboxes}/{sandboxId}/heartbeat`      Record meaningful user
                                                                    activity and renew the
                                                                    lease if the sandbox is
                                                                    healthy and not
                                                                    terminating.

  `POST`                  `/{sandboxes}/{sandboxId}/stop`           Gracefully stop the
                                                                    sandbox while
                                                                    preserving the project.

  `DELETE`                `/{sandboxes}/{sandboxId}`                Request sandbox
                                                                    deletion. This must not
                                                                    delete the project or
                                                                    its MinIO data.
  -----------------------------------------------------------------------------------------

The start endpoint should be idempotent where possible. If a valid
sandbox already exists for the same user and project, return it rather
than creating duplicate pods. Use an idempotency key or a project-level
creation lock to prevent two concurrent start requests from provisioning
duplicate sandboxes.

Example start response:

``` json
{
  "projectId": "project-456",
  "sandboxId": "sandbox-123",
  "status": "restoring",
  "previewUrl": null
}
```

When restoration and readiness checks finish, the status becomes
`running` and the service can return the preview and agent URLs.

### 4.3 Workspace and synchronization

  ----------------------------------------------------------------------------------------------
  Method                  Endpoint                                       Description
  ----------------------- ---------------------------------------------- -----------------------
  `GET`                   `/{sandboxes}/{sandboxId}/files`               List workspace files,
                                                                         excluding generated or
                                                                         unnecessary directories
                                                                         such as `node_modules`,
                                                                         `.git`, caches, and
                                                                         build output.

  `GET`                   `/{sandboxes}/{sandboxId}/files/{filePath}`    Read a file from the
                                                                         active workspace after
                                                                         validating the path and
                                                                         sandbox ownership.

  `PUT`                   `/{sandboxes}/{sandboxId}/files/{filePath}`    Create or replace a
                                                                         workspace file and mark
                                                                         it dirty for
                                                                         synchronization.

  `DELETE`                `/{sandboxes}/{sandboxId}/files/{filePath}`    Delete a workspace file
                                                                         and record a
                                                                         deletion/tombstone for
                                                                         synchronization.

  `POST`                  `/{sandboxes}/{sandboxId}/sync`                Request synchronization
                                                                         of dirty workspace
                                                                         changes to persistent
                                                                         storage.

  `GET`                   `/{projects}/{projectId}/revisions`            List available
                                                                         persisted project
                                                                         revisions.

  `POST`                  `/{projects}/{projectId}/restore/{revision}`   Restore a selected
                                                                         revision, subject to
                                                                         ownership and conflict
                                                                         checks.
  ----------------------------------------------------------------------------------------------

The agent may use internal file tools rather than calling these HTTP
endpoints. The important contract is that every workspace mutation must
be visible to the synchronization mechanism.

### 4.4 AI tasks

  --------------------------------------------------------------------------------------------------
  Method                  Endpoint                                           Description
  ----------------------- -------------------------------------------------- -----------------------
  `POST`                  `/{sandboxes}/{sandboxId}/tasks`                   Start an AI task for
                                                                             the active sandbox.

  `GET`                   `/{sandboxes}/{sandboxId}/tasks/{taskId}`          Get task status and
                                                                             progress.

  `POST`                  `/{sandboxes}/{sandboxId}/tasks/{taskId}/cancel`   Request cancellation of
                                                                             an active task.
  --------------------------------------------------------------------------------------------------

A sandbox must not be removed while an active task is writing files
unless the task has completed, been safely cancelled, or the termination
policy has explicitly handled its partial work.

### 4.5 Internal cleanup endpoints (optional)

  ---------------------------------------------------------------------------------------------------
  Method                  Endpoint                                            Description
  ----------------------- --------------------------------------------------- -----------------------
  `POST`                  `/{internal}/sandboxes/{sandboxId}/terminate`       Internal-only request
                                                                              for graceful
                                                                              termination.

  `POST`                  `/{internal}/sandboxes/{sandboxId}/sync-finalize`   Internal-only request
                                                                              to flush and verify
                                                                              final synchronization.
  ---------------------------------------------------------------------------------------------------

These endpoints must not be exposed as public user APIs. Prefer internal
service calls or a queue/job system if available.

------------------------------------------------------------------------

## 5. Detailed flow

### Step 1 --- Authenticate and load projects

1.  The user signs in through the existing authentication system.
2.  The frontend calls `GET /{projects}`.
3.  The project service obtains the authenticated `userId` from trusted
    authentication context.
4.  MongoDB returns only projects owned by that user.
5.  The response can be sorted by `lastOpenedAt` descending.
6.  The frontend highlights the most recently opened project, but the
    user can choose another project or create a new one.

Never query projects using an untrusted `userId` from the client without
independently checking it against the authenticated identity.

### Step 2 --- Create a project (new project only)

1.  The frontend calls `POST /{projects}`.
2.  The backend validates the project name and creates a MongoDB project
    record.
3.  It assigns a stable `projectId` and an owner.
4.  It establishes a unique MinIO/S3 prefix, for example:

``` text
users/{userId}/projects/{projectId}/
```

5.  It initializes a project manifest or empty initial revision.
6.  It returns the `projectId`.

Project creation does not have to create a Kubernetes pod. Keeping
project creation separate from sandbox provisioning avoids consuming
resources for projects that are not currently open.

### Step 3 --- Start or restore a sandbox

When a user opens a project, the frontend calls:

`POST /{projects}/{projectId}/sandbox/start`

The sandbox service:

1.  Authenticates the caller and verifies project ownership.
2.  Checks whether a healthy sandbox already exists for that user and
    project.
3.  If one exists, returns its details and renews its lease.
4.  Otherwise, acquires a lock or uses an idempotency mechanism to
    prevent duplicate provisioning.
5.  Creates a sandbox record with status `provisioning`.
6.  Creates the Kubernetes resources (pod and any required supporting
    resources).
7.  Waits for readiness probes to pass.
8.  Restores the persisted project snapshot from MinIO into the
    workspace.
9.  Starts or confirms the agent and development server.
10. Verifies that the workspace and preview are ready.
11. Marks the sandbox `running`, creates/renews its Redis lease, and
    returns the sandbox ID and URLs.

A pod being `Running` does not necessarily mean the project is ready.
Restoration, agent readiness, and development-server readiness should be
tracked separately.

### Step 4 --- Restore files from MinIO

Use a deterministic storage prefix, for example:

``` text
users/{userId}/projects/{projectId}/
```

A possible object layout:

``` text
users/
  user-789/
    projects/
      project-456/
        revisions/
          000012/
            package.json
            package-lock.json
            index.html
            src/App.tsx
            src/main.tsx
        manifests/
          current.json
```

S3/MinIO is object storage, not a normal filesystem. It stores objects
with keys; folder-looking paths are key prefixes. The restore service
must list/download the required objects and safely recreate their
relative paths in the workspace.

Do not restore `node_modules`, `.git`, caches, or generated build output
by default. Restore source files, public assets, package manifests, and
lockfiles. Install dependencies in the sandbox using the project's
package manager and lockfile.

Validate every object key and destination path. Do not allow `../`
traversal or absolute paths to escape the workspace.

### Step 5 --- User and agent work

While the sandbox is running:

1.  The user sends prompts to the AI orchestration service.
2.  The agent reads and modifies files in the sandbox workspace.
3.  File tools report create, update, rename, and delete operations.
4.  The workspace tracks changed files (dirty files) and deleted paths
    (tombstones).
5.  The synchronization service uploads changed files and deletes
    removed objects.
6.  A new manifest/revision is published only after the required uploads
    succeed.

For example:

  Workspace operation    Persistent storage operation
  ---------------------- --------------------------------------------------------
  Create `src/App.tsx`   Upload object
  Update `src/App.tsx`   Upload replacement object
  Delete `src/Old.tsx`   Delete object or record tombstone
  Rename a file          Upload new key, then remove old key
  List files             Read workspace or manifest, depending on the operation

Do not upload `node_modules` or temporary files. Use an
allowlist/denylist policy and validate file paths.

### Step 6 --- Redis lease and activity tracking

Redis tracks the temporary sandbox lease. For example:

``` text
Key: sandbox:{sandboxId}
```

Example value:

``` json
{
  "sandboxId": "sandbox-123",
  "projectId": "project-456",
  "userId": "user-789",
  "podName": "sandbox-123",
  "status": "running",
  "lastActivityAt": "2026-11-06T14:00:00.000Z"
}
```

Set an inactivity timeout, for example 30 minutes:

``` typescript
await redis.set(
  `sandbox:${sandboxId}`,
  JSON.stringify(sandboxData),
  "EX",
  1800
);
```

On meaningful user activity, renew the lease:

``` typescript
await redis.expire(`sandbox:${sandboxId}`, 1800);
```

Meaningful activity can include an authenticated user action, an active
editor session, or an ongoing AI task. Do not renew the lease merely
because an internal health probe runs; otherwise an abandoned sandbox
may never expire.

For a real deployment, keep the authoritative sandbox lifecycle record
in a durable store or Kubernetes labels/annotations as well. Redis is
useful for fast lease tracking, but an expiring Redis key alone is not a
durable cleanup queue.

### Step 7 --- Handle inactivity and expiry

Important: Redis key expiration does **not** delete a Kubernetes pod.

A separate cleanup worker must discover expired sandboxes. Do not rely
only on Redis keyspace expiration notifications, because they are not a
guaranteed durable job-delivery mechanism.

Recommended approach:

1.  Maintain a lease with `expiresAt` and sandbox status in a durable
    sandbox record.
2.  Use Redis for fast lease checks and coordination.
3.  Have a periodic worker query for expired active leases, or enqueue a
    delayed cleanup job.
4.  Atomically claim a sandbox for termination so multiple workers
    cannot clean it simultaneously.
5.  Mark it `terminating`.
6.  Reject new agent tasks and workspace mutations.
7.  Allow active AI tasks to finish within a bounded grace period, or
    cancel them safely.
8.  Flush dirty files and tombstones to MinIO.
9.  Verify that the final manifest/revision is committed.
10. Delete the Kubernetes pod and related temporary resources.
11. Mark the sandbox `stopped` or `expired` in the durable record.
12. Remove or expire its Redis lease and temporary session metadata.

If synchronization fails, do not silently claim that the project is
safely saved. Retry, retain the sandbox for recovery when possible, or
mark the project/sandbox as requiring recovery. Apply a maximum
termination grace period so a stuck task cannot consume resources
indefinitely.

### Step 8 --- User returns later

When the user opens the same project again:

1.  The frontend loads the project list or project details.
2.  The user selects the existing `projectId`.
3.  The frontend calls the sandbox start endpoint.
4.  The service sees that the previous sandbox is stopped or expired.
5.  It creates a new `sandboxId` and a new Kubernetes workspace.
6.  It restores the latest committed project revision from MinIO.
7.  It installs dependencies and starts the development environment.
8.  The user continues working on the same project.

The `projectId` stays the same. The `sandboxId` changes.

------------------------------------------------------------------------

## 6. Synchronization correctness and data safety

A simple upload-on-every-save implementation is a useful first version,
but reliable persistence needs explicit rules.

### Dirty-file tracking

Track each changed path and its operation:

``` json
{
  "projectId": "project-456",
  "sandboxId": "sandbox-123",
  "changes": [
    { "path": "src/App.tsx", "operation": "put" },
    { "path": "src/Old.tsx", "operation": "delete" }
  ]
}
```

Coalesce repeated writes to the same path so only the latest content is
uploaded.

### Revision manifest

Maintain a manifest that identifies the complete set of files in a
committed project revision. A revision should be published only after
all objects referenced by it have been uploaded successfully.

Example:

``` json
{
  "projectId": "project-456",
  "revision": 13,
  "parentRevision": 12,
  "files": {
    "package.json": {
      "key": "users/user-789/projects/project-456/revisions/13/package.json",
      "etag": "example-etag"
    },
    "src/App.tsx": {
      "key": "users/user-789/projects/project-456/revisions/13/src/App.tsx",
      "etag": "example-etag"
    }
  }
}
```

For stronger recovery, store each revision under an immutable prefix and
update a small `current.json` pointer only after the revision is
complete. This avoids exposing a partially uploaded project as the
current revision.

### Concurrent editing

If multiple tabs or sandboxes can edit one project, prevent silent
overwrites. Use revision checks, ETags, optimistic concurrency, or a
single-writer lease. If a stale sandbox attempts to publish over a newer
revision, reject the commit and require reconciliation.

### Sync acknowledgements

The agent should not report a change as durably saved until the storage
service confirms the write or committed revision. Track states such as:

-   `dirty`
-   `syncing`
-   `synced`
-   `sync_failed`

Retry transient failures with backoff. Make upload/delete operations
idempotent where possible.

------------------------------------------------------------------------

## 7. Security requirements

1.  Authenticate every project and sandbox API.
2.  Derive `userId` from verified authentication context.
3.  Verify that the user owns `projectId` before creating, reading,
    restoring, or deleting anything.
4.  Verify that `sandboxId` belongs to the authenticated user and
    expected project.
5.  Never accept arbitrary bucket names or storage prefixes from the
    client.
6.  Keep MinIO/S3 credentials on trusted backend services; never expose
    root credentials in browser code or sandbox environment variables.
7.  Give services the minimum required storage permissions. Prefer
    backend-mediated access or narrowly scoped, short-lived credentials.
8.  Validate file paths and prevent path traversal, symlink escapes, and
    unsafe archive extraction.
9.  Keep sandbox pods isolated and enforce resource limits and network
    policies.
10. Protect internal cleanup and synchronization operations from public
    access.
11. Do not trust client-supplied identity headers such as `X-User-ID`;
    strip/overwrite them at the trusted ingress boundary.
12. Apply quotas and limits for project size, file count, upload size,
    and sandbox duration.

------------------------------------------------------------------------

## 8. Failure handling

  -----------------------------------------------------------------------
  Failure                             Expected behavior
  ----------------------------------- -----------------------------------
  Pod fails during provisioning       Mark sandbox failed, clean up
                                      partial Kubernetes resources,
                                      retain project data

  MinIO unavailable during restore    Do not mark sandbox ready; retry or
                                      report restore failure

  Agent crashes after editing         Recover from last committed
                                      revision; retry any durable pending
                                      sync work

  Upload fails during normal work     Keep file dirty and retry; show
                                      sync failure state

  Redis restarts                      Reconstruct active sandbox state
                                      from durable records/Kubernetes and
                                      recreate leases

  Cleanup worker restarts             Re-discover expired leases and
                                      resume idempotent cleanup

  User returns while termination      Reject or queue the start request
  begins                              until the old sandbox is safely
                                      stopped, then provision a new one

  Active AI task exceeds grace period Cancel or terminate according to
                                      policy; preserve last committed
                                      revision and report any unsaved
                                      work

  Two start requests arrive together  Use an idempotency key or
                                      distributed/project lock to avoid
                                      duplicate sandboxes

  Two sandboxes edit one project      Use revision/lease checks and
                                      reject stale commits or reconcile
                                      conflicts
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 9. Suggested implementation order

Build this incrementally rather than implementing every feature at once.

### Phase 1 --- Persistent project storage

-   Create project metadata in MongoDB.
-   Store and retrieve project files from MinIO.
-   Define a deterministic project storage prefix.
-   Implement a manifest or initial revision.

### Phase 2 --- Sandbox restoration

-   Add the start/restore endpoint.
-   Create the Kubernetes sandbox.
-   Download the latest project revision.
-   Start the agent and development server.
-   Return readiness and preview information.

### Phase 3 --- Incremental synchronization

-   Track dirty files and deletions.
-   Upload changed files to MinIO.
-   Commit a manifest/revision after successful synchronization.
-   Exclude generated directories.

### Phase 4 --- Lease and cleanup

-   Add Redis lease renewal.
-   Add durable expiry tracking.
-   Implement a periodic cleanup worker.
-   Add graceful task shutdown and final synchronization.
-   Delete expired Kubernetes resources idempotently.

### Phase 5 --- Reliability and versioning

-   Add optimistic concurrency and revision history.
-   Add recovery from Redis, pod, and storage failures.
-   Add quotas, metrics, and audit logs.
-   Test concurrent starts, interrupted syncs, and abrupt pod
    termination.

------------------------------------------------------------------------

## 10. Final design principles

-   `projectId` is permanent; `sandboxId` is temporary.
-   MongoDB stores project metadata and ownership.
-   MinIO/S3 stores durable project files and revisions.
-   Kubernetes runs disposable development environments.
-   Redis tracks active leases, but Redis TTL does not delete pods.
-   A cleanup worker performs graceful termination.
-   Active AI tasks must be completed or safely cancelled before
    workspace removal.
-   A sandbox is only safe to delete after the latest required changes
    are durably synchronized.
-   Restoring a project means creating a fresh workspace from the latest
    committed revision, not resurrecting the old pod.

The result is a persistent cloud development workspace: users can leave,
their sandbox can disappear, and they can return later to continue
working on the same AI-generated React application.
