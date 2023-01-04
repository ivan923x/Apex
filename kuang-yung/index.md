# Kuang Yung After Sales Service <a id="top"/>

### **目錄**
 * [Shared Components](#shared-components)
 * [Page 0 Global](#page-0-global)
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

[top]: #top     "Go Top"
[2]: ./Page2.md    "Go Page 2"
[3]: ./Page3.md    "Go Page 3"
[9]: ./Page9.md    "Go Page 9"
[10]: ./Page10.md  "Go Page 10"
[11]: ./Page11.md  "Go Page 11"
[12]: ./Page12.md  "Go Page 12"
[13]: ./Page13.md  "Go Page 13"
[14]: ./Page14.md  "Go Page 14"
[15]: ./Page15.md  "Go Page 15"
[16]: ./Page16.md  "Go Page 16"
[17]: ./Page17.md  "Go Page 17"

## Shared Components
* ### Lists of Values
  1. SERVICE_REQUEST_STATUS (create)
     1. * Create List of Values : From Scratch
     1. * Type : Static
     1. * LOV :
        1. `待指派` `1`
        1. `待回覆` `2`
        1. `待裁定` `3`
        1. `已解決` `4`
  1. FILL_IN_TYPE (create)
     1. * Create List of Values : From Scratch
     1. * Type : Static
     1. * LOV :
        1. `原因分析` `1`
        1. `臨時對策` `2`
        1. `再發生防止` `3`
  1. RULING_RESULT (create)
     1. * Create List of Values : From Scratch
     1. * Type : Static
     1. * LOV :
        1. `不核可` `0`
        1. `核可` `1`
  1. EMPLOYEE (create)
     1. * Create List of Values : From Scratch
     1. * Type : Dynamic
     1. * Source Type : SQL Query
        * Enter a SQL SELECT statement :
          ```sql
          SELECT name, id FROM app_employee;
          ```
  1. QC_STAFF (create)
     1. * Create List of Values : From Scratch
     1. * Type : Dynamic
     1. * Source Type : SQL Query
        * Enter a SQL SELECT statement :
          ```sql
          SELECT name, id FROM app_employee WHERE dept_id = 3;
          ```
  1. CUSTOMER (create)
     1. * Create List of Values : From Scratch
     1. * Type : Dynamic
     1. * Source Type : SQL Query
        * Enter a SQL SELECT statement :
          ```sql
          SELECT name, id FROM app_customer
          ```
  1. ITEM (create)
     1. * Create List of Values : From Scratch
     1. * Type : Dynamic
     1. * Source Type : SQL Query
        * Enter a SQL SELECT statement :
          ```sql
          SELECT name, id FROM app_item;
          ```
* ### Static Application Files
  * Upload File :
    1. main.js
    1. customize.css
* ### User Interface Attributes
  * JavaScript > File URLs : `#APP_IMAGES#customize.js?version=#APP_VERSION#` (add)
  * Cascading Style Sheets > File URLs : `#APP_IMAGES#customize.css?version=#APP_VERSION#` (add)
* ### (Other)
  * Edit Logo Text => User Interface Attributes > Logo
  * Edit Lists Text => Lists > (List Details) > (Entry) > List Entry Label
  * Edit Breadcrumbs Text => Breadcrumbs > (Breadcrumb) > (Entry) > Short Name

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

## Page 1 Home

#### **# UI** [▲][top]
* Identification > Name : `Home`
* Identification > Page Alias : `home`
* Identification > Title : `廣穎售後服務 | 首頁`

*Regions*
1. Static Content : 廣穎售後服務 (after change)
   * Identification > Title : `廣穎售後服務`

## Page 9999 Login Page

#### **# UI** [▲][top]
* Identification > Name : `Login Page`
* Identification > Page Alias : `login`
* Identification > Title : `廣穎售後服務 | 登入`

*Regions*
1. Static Content : 廣穎售後服務 (after change)
   * Identification > Title : `廣穎售後服務`

---
All Breadcrumb: Appearance / Template Options: Use Compact Style
