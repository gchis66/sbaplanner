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
  TabStopType,
} from "docx";
import { jsPDF } from "jspdf";
import { Packer } from "docx";
import sizeOf from "image-size";

function convertContentToSections(content) {
  // Split content into sections based on headings
  const sections = content.split(/(?=\n[A-Z][^a-z\n:]*:)/);
  return sections
    .map((section) => {
      let [title, ...contentLines] = section.trim().split("\n");

      // Just remove the colon and trim
      title = title
        .replace(/:\s*$/, "") // Remove trailing colons
        .trim();

      return {
        title: title,
        content: contentLines.join("\n").trim(),
      };
    })
    .filter((section) => section.title && section.content);
}

function createTitlePage(businessName, logoBase64, date) {
  const children = [];

  // Add title page elements first
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

  // Add logo after the title elements if provided
  if (logoBase64) {
    try {
      const imageBuffer = Buffer.from(
        logoBase64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      // Get original dimensions
      const dimensions = sizeOf(imageBuffer);

      // Set desired width and calculate height to maintain aspect ratio
      const desiredWidth = 200; // Width in points
      const aspectRatio = dimensions.width / dimensions.height;
      const calculatedHeight = desiredWidth / aspectRatio;

      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: imageBuffer,
              transformation: {
                width: desiredWidth,
                height: calculatedHeight,
              },
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 400,
            after: 400,
          },
        })
      );
    } catch (error) {
      console.error("Error adding logo to DOCX:", error);
    }
  }

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
          top: 1440,
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
            size: 48,
            bold: true,
            font: "Arial",
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 480,
          after: 240,
          line: 360,
          lineRule: LineRuleType.AUTO,
        },
      })
    );

    // Rest of content processing remains the same
    const contentParagraphs = section.content.split("\n");
    contentParagraphs.forEach((para) => {
      if (para.trim().startsWith("- ")) {
        sectionParagraphs.push(
          new Paragraph({
            text: para.trim().substring(2),
            bullet: {
              level: 0,
            },
            spacing: {
              before: 120,
              after: 120,
              line: 276,
              lineRule: LineRuleType.AUTO,
            },
          })
        );
      } else {
        sectionParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: para.trim(),
                size: 24,
                font: "Arial",
              }),
            ],
            spacing: {
              before: 240,
              after: 240,
              line: 276,
              lineRule: LineRuleType.AUTO,
            },
          })
        );
      }
    });

    return sectionParagraphs;
  });

  // Add main content section with footer
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
                size: 20,
                font: "Arial",
              }),
              new TextRun({
                text: "                                                                                                                                        ", // 120 spaces
                size: 20,
              }),
              new TextRun({
                children: [PageNumber.CURRENT],
                size: 20,
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
            size: 24,
            font: "Arial",
          },
          paragraph: {
            spacing: {
              line: 276,
              before: 240,
              after: 240,
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
  yPosition = 20;

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
  yPosition += 30;

  // Add logo if provided
  if (logoBase64) {
    try {
      const imageBuffer = Buffer.from(
        logoBase64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      // Get original dimensions
      const dimensions = sizeOf(imageBuffer);

      // Set desired width and calculate height to maintain aspect ratio
      const desiredWidth = 70; // Width in PDF units
      const aspectRatio = dimensions.width / dimensions.height;
      const calculatedHeight = desiredWidth / aspectRatio;

      const imgX = (pageWidth - desiredWidth) / 2;
      doc.addImage(
        logoBase64,
        "PNG",
        imgX,
        yPosition,
        desiredWidth,
        calculatedHeight
      );
      yPosition += calculatedHeight + 20;
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }
  }

  // Content pages
  sections.forEach((section) => {
    doc.addPage();
    yPosition = 30;

    // Section title with enhanced formatting
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(section.title.toUpperCase(), margin, yPosition);
    yPosition += 20;

    // Section content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Process paragraphs
    const paragraphs = section.content.split("\n");
    paragraphs.forEach((para) => {
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
    doc.setFontSize(10);

    // Left-aligned business name
    doc.setFont("helvetica", "bold");
    doc.text(businessName, margin, pageHeight - 10);

    // Right-aligned page number (calculate exact position)
    doc.setFont("helvetica", "normal");
    const pageNumText = i.toString();
    const pageNumWidth =
      (doc.getStringUnitWidth(pageNumText) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    doc.text(pageNumText, pageWidth - margin - pageNumWidth, pageHeight - 10);
  }

  return doc.output("arraybuffer");
}
