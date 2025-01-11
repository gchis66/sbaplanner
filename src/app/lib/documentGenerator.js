import {
  Document,
  Paragraph,
  HeadingLevel,
  TextRun,
  PageNumber,
  AlignmentType,
  PageOrientation,
  Header,
  Footer,
  LineRuleType,
  ImageRun,
} from "docx";
import { jsPDF } from "jspdf";
import { Packer } from "docx";

function convertContentToSections(content) {
  // Split content into sections based on headings
  const sections = content.split(/(?=\n[A-Z][^a-z\n:]*:)/);
  return sections
    .map((section) => {
      const [title, ...contentLines] = section.trim().split("\n");
      return {
        title: title.replace(":", "").trim(),
        content: contentLines.join("\n").trim(),
      };
    })
    .filter((section) => section.title && section.content);
}

export async function generateDocx(businessName, content, logoBase64) {
  const sections = convertContentToSections(content);

  const children = [];

  // Add logo if provided
  if (logoBase64) {
    try {
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: Buffer.from(
                logoBase64.replace(/^data:image\/\w+;base64,/, ""),
                "base64"
              ),
              transformation: {
                width: 100,
                height: 100,
              },
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400,
          },
        })
      );
    } catch (error) {
      console.error("Error adding logo to DOCX:", error);
      // Continue without the logo if there's an error
    }
  }

  // Add title and content
  children.push(
    new Paragraph({
      text: businessName,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400,
      },
    }),
    ...sections.flatMap((section) => [
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 400,
          after: 200,
        },
      }),
      new Paragraph({
        text: section.content,
        spacing: {
          before: 200,
          after: 400,
        },
      }),
    ])
  );

  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          quickFormat: true,
          run: {
            size: 24, // 12pt
            font: "Calibri",
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5 line spacing
              before: 240, // 12pt before
              after: 240, // 12pt after
            },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: businessName,
                    bold: true,
                  }),
                  new TextRun({
                    text: "\t\t",
                  }),
                  new TextRun({
                    children: ["Page ", PageNumber.CURRENT],
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  try {
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  } catch (error) {
    console.error("Error generating DOCX:", error);
    throw new Error("Failed to generate DOCX document");
  }
}

export async function generatePdf(businessName, content, logoBase64) {
  const sections = convertContentToSections(content);
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Add logo if provided
  if (logoBase64) {
    try {
      // Remove the data:image/png;base64, prefix if it exists
      const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, "");
      const imgWidth = 40;
      const imgHeight = 40;
      const imgX = (pageWidth - imgWidth) / 2;
      doc.addImage(base64Data, "PNG", imgX, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
      // Continue without the logo if there's an error
    }
  }

  // Add title
  doc.setFontSize(24);
  doc.text(businessName, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 20;

  // Add sections
  sections.forEach((section) => {
    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPosition = 20;
    }

    // Add section title
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(section.title, margin, yPosition);
    yPosition += 10;

    // Add section content
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");

    // Split content into lines that fit the page width
    const lines = doc.splitTextToSize(section.content, contentWidth);

    // Check if we need a new page for the content
    if (yPosition + lines.length * 7 > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPosition = 20;
    }

    doc.text(lines, margin, yPosition);
    yPosition += lines.length * 7 + 10;
  });

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `${businessName} - Page ${i} of ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }

  return doc.output("arraybuffer");
}
