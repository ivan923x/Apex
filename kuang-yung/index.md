# Kuang Yung After Sales Service

### **目錄**
 * [Shared Components](#shared-components)
 * [Page 0](#page-0)
 * [Page 2 handling-form-operate-index][2]
 * [Page 3 handling-form-fillin-index][3]
 * [Page 9 show][9]
 * [Page 10 create][10]
 * [Page 11 confirm][11]
 * [Page 12 assign][12]
 * [Page 13 fill-in][13]
 * [Page 14 ruling][14]
 * [Page 15 upload-temporary-attachment][15]
 * [Page 16 upload-attachment][16]
 * [Page 17 service_request_edit][17]

[top]: #top       "Go Top"
[2]: ./page2    "Go Page 2"
[3]: ./page3    "Go Page 3"
[9]: ./page9    "Go Page 9"
[10]: ./page10  "Go Page 10"
[11]: ./page11  "Go Page 11"
[12]: ./page12  "Go Page 12"
[13]: ./page13  "Go Page 13"
[14]: ./page14  "Go Page 14"
[15]: ./page15  "Go Page 15"
[16]: ./page16  "Go Page 16"
[17]: ./page17  "Go Page 17"

---

## Shared Components
* Lists of Values
  1. Service_Request_Status (create)
     1. From Scratch, Static
     *  LOV :
        1. 待指派, 1
        1. 待回覆, 2
        1. 待裁定, 3
        1. 已解決, 4
* Static Application Files
  * Upload File :
    1. main.js
    1. customize.css
* User Interface Attributes
  * JavaScript > File URLs : `#APP_IMAGES#customize.js?version=#APP_VERSION#` *(add)*
  * Cascading Style Sheets > File URLs : `#APP_IMAGES#customize.css?version=#APP_VERSION#` *(add)*\


Create Service_Request_Status
    From Scratch, Static
    待指派, 1
    待回覆, 2
    待裁定, 3
    已解決, 4
Create Fill_In_Type
    From Scratch, Static
    原因分析, 1
    臨時對策, 2
    再發生防止, 3
Create Ruling_Result
    From Scratch, Static
    不核可, 0
    核可, 1

All Breadcrumb: Appearance / Template Options: Use Compact Style

---

## Page 0 Global

#### **# UI** [▲][top]
* Identification > Name : `Home`
* Identification > Page Alias : `home`
* Identification > Title : `廣穎售後服務 | 首頁`

*Regions*
1. Static Content (create)
   * Identification > Title : `圖片預覽`
   * Source > Text :
     ```html
     <div id="preview_mask" onclick="closePreview();"></div>
     ```
   * Layout > Position : *Before Footer*
   * Appearance > Template Options > General : *Remove Body Padding* (change)
   * Appearance > Template Options > Header : *Hidden*
   * Appearance > Template Options > Style : *Text Content*

---

## Page 1 Home

#### **# UI** [▲][top]
* Identification > Name : `Home`
* Identification > Page Alias : `home`
* Identification > Title : `廣穎售後服務 | 首頁`

*Regions*
1. Static Content : 廣穎售後服務 (after change)
   * Identification > Title : `廣穎售後服務`

---

## Page 9999 Login Page

#### **# UI** [▲][top]
* Identification > Name : `Login Page`
* Identification > Page Alias : `login`
* Identification > Title : `廣穎售後服務 | 登入`

*Regions*
1. Static Content : 廣穎售後服務 (after change)
   * Identification > Title : `廣穎售後服務`