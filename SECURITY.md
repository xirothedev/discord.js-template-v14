# File Security Policy

This document outlines the security policies and best practices for handling files within this project.

## 1. File Upload Restrictions

- **Allowed File Types:**  
  Only the following file types are permitted for upload:  
  - Images: `.jpg`, `.jpeg`, `.png`, `.gif`
  - Documents: `.pdf`, `.docx`, `.xlsx`
- **Maximum File Size:**  
  Each uploaded file must not exceed **10MB**.
- **File Name Validation:**  
  - File names must not contain special characters or path traversal sequences (`../`).
  - File extensions must match the actual file content (MIME type check).

## 2. Storage and Access

- **Upload Directory:**  
  All uploaded files are stored in a dedicated, non-public directory (`/uploads`).
- **Access Control:**  
  - Only authenticated users can upload or download files.
  - Users can only access files they own or have been granted permission to view.
- **Temporary Files:**  
  Temporary files are deleted after processing to prevent unauthorized access.

## 3. Virus and Malware Scanning

- All uploaded files are scanned for viruses and malware before being stored or processed.
- Infected files are immediately deleted and the upload is rejected.

## 4. Data Protection

- **Encryption:**  
  Sensitive files are encrypted at rest using industry-standard algorithms.
- **Transmission:**  
  All file transfers use HTTPS to ensure data is encrypted in transit.

## 5. Logging and Monitoring

- All file upload and download activities are logged for auditing purposes.
- Suspicious activities (e.g., repeated failed uploads, unusual file types) are monitored and flagged.

## 6. Reporting Vulnerabilities

If you discover a security vulnerability related to file handling, please report it by opening an issue or contacting the maintainers at [lethanhtrung.trungle@gmail.com](mailto:lethanhtrung.trungle@gmail.com).

---

_Last updated: 2025-07-02_ 