import axios from 'axios';

const sandboxId = "01a178cf-ab86-72d4-9c22-1ab010363529"
const sandboxClient = axios.create({
  baseURL: "http://127.0.0.1",
  timeout: 15_000,
  headers: {
    Host: `${sandboxId}.agent.localhost`,
  },
});
async function createTest() {
  const response = await sandboxClient.post("/create-files",{
    files:[
      {
        "/test1.jsx":"console.log(\"Hello World\")"
      }
    ]
  })
  console.log(response.data);
  
}
await createTest()