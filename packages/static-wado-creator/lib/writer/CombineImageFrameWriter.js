const uids = require("../model/uids");
const WriteStream = require("./WriteStream");
const WriteMultipart = require("./WriteMultipart");
const ExpandUriPath = require("./ExpandUriPath");
const { MultipartHeader, MultipartAttribute } = require("./MultipartHeader");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const CombineImageFrameWriter = (options) => async (id, index, imageFrame) => {
  const rawStream = fs.createWriteStream(`${id.seriesRootPath}/1`, {
    flags: "a",
    encoding: null,
    mode: 0666,
  });

  const { transferSyntaxUid } = id;

  let content;
  if (imageFrame instanceof Uint8Array) {
    content = imageFrame;
  } else {
    content = Buffer.from(imageFrame.buffer);
  }

  const type = uids[transferSyntaxUid] || uids.default;

  const headers = [new MultipartHeader("Content-Type", type.contentType, [new MultipartAttribute("transfer-syntax", transferSyntaxUid)])];

  const boundaryId = uuid();
  //await rawStream.write(`--BOUNDARY_${boundaryId}\r\n`);
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    //await rawStream.write(`${header.headerName}: ${header.headerValue}`);
    if (header.attributes) {
      for (let j = 0; j < header.attributes.length; j++) {
        const attribute = header.attributes[j];
        //await rawStream.write(`;${attribute.attributeName}=${attribute.attributeValue}`);
      }
    }
    //await rawStream.write("\r\n");
  }
  //await rawStream.write("\r\n");
  //await rawStream.write(content);
 // await rawStream.write(`\r\n--BOUNDARY_${boundaryId}--`);

  //rawStream.close();
};

module.exports = CombineImageFrameWriter;
