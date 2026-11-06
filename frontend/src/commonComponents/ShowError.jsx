const ShowError = (data) => {
  return (
    <>
      {data.error && typeof data.error === "string" && data.error !== "" && (
        <small className="text-red-500 italic text-center">
          ⚠️ {data.error || ""}
        </small>
      )}
    </>
  );
};

export default ShowError;
