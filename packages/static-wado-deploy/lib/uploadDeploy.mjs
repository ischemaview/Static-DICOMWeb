import fs from "fs";
import DeployGroup from "./DeployGroup.mjs";

const files = [];

export default async function uploadMain(storeDirectory, config, name, options, deployPlugin) {
  const deployer = new DeployGroup(config, name, options, deployPlugin);
  await deployer.loadOps();

  // let listOfFiles = [];
  // listOfFiles.push(await deployer.store(storeDirectory));
  // run();

  function uploadFile(deployer, fileObject) {
    return new Promise((resolve, reject) => {
      try {
        resolve(deployer.uploadFile(fileObject.baseDir, fileObject.relativeName, fileObject.size));
      } catch (e) {
        reject();
      }
    });
  }

  async function uploadFiles(deployer, files) {
    const uploadPromises = files.map((file) => {
      uploadFile(deployer, file);
    });
    try {
      const result = await Promise.allSettled(uploadPromises);
      console.log(result);
    } catch (e) {
      console.log("Error occured while uploading file");
    }
  }

  // await function getDirectories (src, callback) {
  //   async glob(src + '/**', callback);
  // };

  function ThroughDirectory(Directory) {
    fs.readdirSync(Directory).forEach(async (File) => {
      const Absolute = path.join(Directory, File);
      const fileState = fs.statSync(Absolute);
      if (fileState.isDirectory()) return ThroughDirectory(Absolute);

      const fileObj = {};
      fileObj.baseDir =
        "/Users/HemantP/Documents/RapidAI/DicomWebScp/studies/1.2.826.0.1.3680043.8.498.12528807687261236410802483768487250000/series/1.2.826.0.1.3680043.8.498.99131721363177735334790292931144139824";
      fileObj.relativeName = Absolute.replace(
        "/Users/HemantP/Documents/RapidAI/DicomWebScp/studies/1.2.826.0.1.3680043.8.498.12528807687261236410802483768487250000/series/1.2.826.0.1.3680043.8.498.99131721363177735334790292931144139824",
        ""
      );
      fileObj.size = fileState.size;

      return files.push(fileObj);
    });
  }

  ThroughDirectory(`${options.rootDir}/${storeDirectory}`, files);
  // let sourceDirPath = options.rootDir + '/' +storeDirectory;
  // const ignorePattern = `${sourceDirPath}/_*/**`;

  // getDirectories(sourceDirPath, {ignore: [ignorePattern], nodir: true}, function (err, res) {
  //   if (err) {
  //     console.log('Error', err);
  //   } else {
  //     console.log(res);
  //   }
  // });
  uploadFiles(deployer, files);

  console.log("Stored", storeDirectory);
}
