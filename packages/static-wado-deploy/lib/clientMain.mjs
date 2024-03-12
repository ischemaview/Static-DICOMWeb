import commonMain from "./commonMain.mjs";
import uploadDeploy from "./uploadDeploy.mjs";

export default async function (options) {
  console.time("upload started");
  await commonMain(this, "client", options, uploadDeploy.bind(null, undefined));
  console.timeEnd("upload started");
}
