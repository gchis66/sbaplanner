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
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  TableLayoutType,
  ShadingType,
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
                width: 150,
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
    }
  }

  // Add title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: businessName.toUpperCase(),
          size: 36,
          bold: true,
          color: "000000",
        }),
        new TextRun({
          text: "\nBUSINESS PLAN",
          size: 32,
          bold: true,
          color: "000000",
          break: 1,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400,
        line: 360,
      },
    })
  );

  // Add date
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 800,
      },
    })
  );

  // Add sections with enhanced formatting
  sections.forEach((section) => {
    // Add section heading
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            size: 28,
            bold: true,
            color: "000000",
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 400,
          after: 200,
        },
        pageBreakBefore: true,
      })
    );

    // Add horizontal line after heading
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "_______________________________________________________________",
            size: 24,
            color: "808080",
          }),
        ],
        spacing: {
          before: 100,
          after: 400,
        },
      })
    );

    // Process content and add with proper formatting
    const contentParagraphs = section.content.split("\n").map((line) => {
      if (line.trim().startsWith("-")) {
        // Format bullet points
        return new Paragraph({
          children: [
            new TextRun({
              text: "•",
              size: 24,
            }),
            new TextRun({
              text: line.replace("-", "").trim(),
              size: 24,
            }),
          ],
          indent: {
            left: 720, // 0.5 inch
          },
          spacing: {
            before: 120,
            after: 120,
            line: 360,
          },
        });
      } else {
        // Regular paragraph
        return new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 24,
            }),
          ],
          spacing: {
            before: 120,
            after: 120,
            line: 360,
          },
        });
      }
    });

    children.push(...contentParagraphs);
  });

  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          quickFormat: true,
          run: {
            size: 24,
            font: "Calibri",
          },
          paragraph: {
            spacing: {
              line: 360,
              before: 240,
              after: 240,
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
              top: 1440,
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
                    size: 20,
                  }),
                  new TextRun({
                    text: "\t\tBusiness Plan",
                    size: 20,
                  }),
                  new TextRun({
                    text: "\t\tPage ",
                    size: 20,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 20,
                  }),
                  new TextRun({
                    text: " of ",
                    size: 20,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "CONFIDENTIAL",
                    size: 16,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
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
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  // Set initial position and constants
  let yPosition = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - 2 * margin;

  // Add logo if provided
  if (logoBase64) {
    try {
      const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, "");
      const imgWidth = 150;
      const imgHeight = 100;
      const imgX = (pageWidth - imgWidth) / 2;
      doc.addImage(base64Data, "PNG", imgX, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 20;
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }
  }

  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(businessName.toUpperCase(), pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 30;

  doc.setFontSize(20);
  doc.text("BUSINESS PLAN", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 30;

  // Add date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  doc.text(date, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 40;

  // Process sections
  sections.forEach((section) => {
    // Add page break for each section
    doc.addPage();
    yPosition = 50;

    // Add header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(section.title.toUpperCase(), margin, yPosition);
    yPosition += 20;

    // Add horizontal line
    doc.setDrawColor(128, 128, 128);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 30;

    // Process content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const lines = section.content.split("\n");

    lines.forEach((line) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 50;
      }

      if (line.trim().startsWith("-")) {
        // Bullet point
        const bulletText = "•" + line.replace("-", "").trim();
        const wrappedText = doc.splitTextToSize(bulletText, contentWidth - 20);
        wrappedText.forEach((textLine) => {
          doc.text(textLine, margin + 20, yPosition);
          yPosition += 20;
        });
      } else {
        // Regular text
        const wrappedText = doc.splitTextToSize(line, contentWidth);
        wrappedText.forEach((textLine) => {
          doc.text(textLine, margin, yPosition);
          yPosition += 20;
        });
      }
    });
  });

  // Add page numbers and headers to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(businessName, margin, 20);
    doc.setFont("helvetica", "normal");
    doc.text("Business Plan", pageWidth / 2, 20, { align: "center" });
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, 20, {
      align: "right",
    });

    // Footer
    doc.setFont("helvetica", "bold");
    doc.text("CONFIDENTIAL", pageWidth / 2, pageHeight - 20, {
      align: "center",
    });
  }

  return doc.output("arraybuffer");
}
