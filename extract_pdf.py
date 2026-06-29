import pypdf

def extract_pdf_text(pdf_path, txt_path):
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for idx, page in enumerate(reader.pages):
        text += f"--- Page {idx + 1} ---\n"
        text += page.extract_text() or ""
        text += "\n\n"
    
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Extracted {len(reader.pages)} pages to {txt_path}")

if __name__ == "__main__":
    extract_pdf_text("Bien_ban_cuoc_hop_online_Vinfast_2306_v2.pdf", "extracted_meeting_minutes.txt")
