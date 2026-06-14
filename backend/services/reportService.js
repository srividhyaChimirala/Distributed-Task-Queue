// import PDFDocument from "pdfkit";
// import fs from "fs";

// export const generateReport = async (data) => {
//   try {
//     const filePath = `reports/report-${Date.now()}.pdf`;

//     const doc = new PDFDocument();

//     doc.pipe(fs.createWriteStream(filePath));

//     doc.fontSize(25).text(data.title);

//     doc.moveDown();

//     data.content.forEach((item, index) => {
//       doc
//         .fontSize(16)
//         .text(`${index + 1}. ${item}`);
//     });

//     doc.end();

//     return filePath;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };



import PDFDocument from "pdfkit";
import fs from "fs";

export const generateReport = async (data) => {
  try {
    const filePath = `reports/report-${Date.now()}.pdf`;

    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(25).text(data.title);

    doc.moveDown();

    doc
      .fontSize(16)
      .text(data.content);

    doc.end();

    return filePath;

  } catch (error) {
    throw new Error(error.message);
  }
};