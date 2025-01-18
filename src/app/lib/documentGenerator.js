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
  WidthType,
  BorderStyle,
  TableOfContents,
  Spacing,
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

function createTitlePage(businessName, logoBase64, date) {
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
                height: 150,
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

  // Add title page elements
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: businessName.toUpperCase(),
          size: 48, // 24pt
          bold: true,
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400,
      },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "BUSINESS PLAN",
          size: 36, // 18pt
          bold: true,
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 800,
      },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text:
            date ||
            new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
          size: 24, // 12pt
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400,
      },
    })
  );

  return children;
}

export async function generateDocx(businessName, content, logoBase64, date) {
  const sections = convertContentToSections(content);

  // Create document sections
  const documentSections = [];

  // Title Page Section
  documentSections.push({
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
    children: createTitlePage(businessName, logoBase64, date),
  });

  // Main Content Section
  const mainContentChildren = sections.flatMap((section) => {
    const sectionParagraphs = [];

    // Add section title with enhanced formatting
    sectionParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            size: 40, // 20pt
            bold: true,
            font: "Arial",
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 480, // 24pt
          after: 240, // 12pt
          line: 360,
          lineRule: LineRuleType.AUTO,
        },
      })
    );

    // Process content and split into paragraphs
    const contentParagraphs = section.content.split("\n");
    contentParagraphs.forEach((para) => {
      if (para.trim().startsWith("- ")) {
        // Bullet point
        sectionParagraphs.push(
          new Paragraph({
            text: para.trim().substring(2),
            bullet: {
              level: 0,
            },
            spacing: {
              before: 120, // 6pt
              after: 120, // 6pt
              line: 276, // 1.15 lines
              lineRule: LineRuleType.AUTO,
            },
          })
        );
      } else {
        // Regular paragraph
        sectionParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: para.trim(),
                size: 24, // 12pt
                font: "Arial",
              }),
            ],
            spacing: {
              before: 240, // 12pt
              after: 240, // 12pt
              line: 276, // 1.15 lines
              lineRule: LineRuleType.AUTO,
            },
          })
        );
      }
    });

    return sectionParagraphs;
  });

  documentSections.push({
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
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: businessName,
                bold: true,
                size: 20, // 10pt
                font: "Arial",
              }),
              new TextRun({
                text: "\t".repeat(16), // Add spacing between business name and page number
              }),
              new TextRun({
                children: [PageNumber.CURRENT],
                size: 20, // 10pt
                font: "Arial",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
        ],
      }),
    },
    children: mainContentChildren,
  });

  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          quickFormat: true,
          run: {
            size: 24, // 12pt
            font: "Arial",
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing
              before: 240, // 12pt before
              after: 240, // 12pt after
            },
          },
        },
      ],
    },
    sections: documentSections,
  });

  try {
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  } catch (error) {
    console.error("Error generating DOCX:", error);
    throw new Error("Failed to generate DOCX document");
  }
}

export async function generatePdf(businessName, content, logoBase64, date) {
  const sections = convertContentToSections(content);
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Set default font
  doc.setFont("helvetica");

  // Title Page
  if (logoBase64) {
    try {
      const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, "");
      const imgWidth = 50;
      const imgHeight = 50;
      const imgX = (pageWidth - imgWidth) / 2;
      doc.addImage(base64Data, "PNG", imgX, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 20;
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }
  }

  // Company Name
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(businessName.toUpperCase(), pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 15;

  // Business Plan subtitle
  doc.setFontSize(18);
  doc.text("BUSINESS PLAN", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 30;

  // Date
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const currentDate =
    date ||
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  doc.text(currentDate, pageWidth / 2, yPosition, { align: "center" });

  // Content pages
  sections.forEach((section) => {
    doc.addPage();
    yPosition = 30;

    // Section title with enhanced formatting
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(section.title.toUpperCase(), margin, yPosition);
    yPosition += 15;

    // Section content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Split content into paragraphs
    const paragraphs = section.content.split("\n");
    paragraphs.forEach((para) => {
      // Handle bullet points
      if (para.trim().startsWith("- ")) {
        const bulletText = para.trim().substring(2);
        const lines = doc.splitTextToSize(bulletText, contentWidth - 10);

        lines.forEach((line, index) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 30;
          }

          if (index === 0) {
            doc.text("•", margin, yPosition);
          }
          doc.text(line, margin + 5, yPosition);
          yPosition += 7;
        });
        yPosition += 3;
      } else {
        // Regular paragraph
        const lines = doc.splitTextToSize(para.trim(), contentWidth);

        lines.forEach((line) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 30;
          }
          doc.text(line, margin, yPosition);
          yPosition += 7;
        });
        yPosition += 3;
      }
    });
  });

  // Add footers to all pages except title page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer with business name and page number
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(businessName, margin, pageHeight - 10);
    doc.setFont("helvetica", "normal");
    doc.text(i.toString(), pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }

  return doc.output("arraybuffer");
}
