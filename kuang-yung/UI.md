廣穎售後服務

#區域設定
P2 handling-form-operate-index
P3 handling-form-fillin-index
P9 show
P10 create
P11 confirm
P12 assign
P13 fill-in
P14 ruling
P15 upload-temporary-attachment
P16 upload-attachment
P17 service_request_edit


#全域設定
[Home]Page
Title: 廣穎售後服務
[login]Page
Static Content Title: 廣穎售後服務

Customize > Edit Logo: 廣穎售後服務
Shared Components / Lists 中文化
Shared Components / Breadcrumbs 中文化
Shared Components / Lists of Values:
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


#建立流程
Upload: customize.js, customize.css
Shared Components > User Interface Attributes > Edit Js/Css File URLs:
#APP_IMAGES#customize.js?version=#APP_VERSION#
#APP_IMAGES#customize.css?version=#APP_VERSION#


#P0
    Create: Static Content 圖片預覽
        Text:
            <div id="preview_mask" onclick="closePreview();"></div>
        Appearance:
            Remove Body Padding, Header Hidden, Style Text Content
        Layout/Position: Before Footer


#P2
    Name: 申報單瀏覽 (售服/品保)
    Title: 廣穎售後服務 | 處理單操作
    Edit Breadcrumb: Template Options: Use Compact Style
    Create: IR 申報單瀏覽
        SQL: `
            SELECT sr.id,
                '檢視' AS "SHOW",
                CASE sr.status -- 連結名稱
                    WHEN 1 THEN '指派'
                    WHEN 3 THEN '裁定'
                    ELSE '檢視'
                    END AS "OPERATE_NAME",
                sr.doc_num,
                sr.file_date,
                er.name AS "REQU_NAME",
                i.name AS "ITEM_NAME",
                c.name AS "CUST_NAME",
                ecp.name AS "CONFIRM_PERSON",
                sr.confirm_date,
                CASE sr.ruling_result -- 裁定狀態
                    WHEN 0 THEN '不核可'
                    WHEN 1 THEN '核可'
                    ELSE ''
                    END AS "RULING_RESULT",
                sr.ruling_date,
                CASE sr.status -- 處理狀態
                    WHEN 1 THEN '待指派'
                    WHEN 2 THEN '待回覆'
                    WHEN 3 THEN '待裁定'
                    WHEN 4 THEN '已解決'
                    ELSE ''
                    END AS "STATUS",
                CASE sr.status -- 連結網址
                    WHEN 1 THEN APEX_PAGE.GET_URL(
                        p_page   => 11,
                        p_items  => 'P11_ID',
                        p_values => sr.ID )
                    WHEN 3 THEN APEX_PAGE.GET_URL(
                        p_page   => 14,
                        p_items  => 'P14_ID',
                        p_values => sr.ID )
                    ELSE APEX_PAGE.GET_URL(
                        p_page   => 9,
                        p_items  => 'P9_ID,P9_FROM_PAGE',
                        p_values => sr.ID||',2' )
                    END AS "OPERATE_URL"
            FROM app_service_request sr
            LEFT JOIN app_item i ON sr.item_id = i.id
            LEFT JOIN app_employee er ON sr.requestor = er.id
            LEFT JOIN app_customer c ON sr.customer = c.id
            LEFT JOIN app_employee ecp ON sr.confirm_person = ecp.id
            ORDER BY sr.file_date DESC, sr.doc_num DESC
        `
        All* Alignment: Center, Exception: ITEM_NAME
        Column Hidden => ID, OPERATE_URL
        Format Mask: YYYY/MM/DD => FILE_DATE, CONFIRM_DATE, RULING_DATE
        Create: Button Text[Hot] CREATE 立案
            Button Position: Right of Interactive Report Search Bar
            Link: Page 10
        Link: Page 9; P9_ID; #ID# => SHOW
        Server-side: Rows Returned => SHOW, Button CREATE:
            SELECT id FROM app_employee e WHERE e.username = :APP_USER AND (e.position = 0 OR e.dept_id = 7)
        Link(URL): #OPERATE_URL# => OPERATE_NAME
        Server-side: Rows Returned => OPERATE_NAME:
            SELECT id FROM app_employee e WHERE e.username = :APP_USER AND (e.position = 0 OR e.dept_id = 3)


#P3
    Name: 申報單瀏覽 (責任單位)
    Title: 廣穎售後服務 | 責任回覆
    Edit Breadcrumb: Template Options: Use Compact Style
    Create: IR 申報單瀏覽
        SQL:`
            SELECT sr.id,
                '填寫' AS "FILL_IN",
                sr.doc_num,
                sr.file_date,
                er.name AS "REQU_NAME",
                i.name AS "ITEM_NAME",
                c.name AS "CUST_NAME",
                ecp.name AS "CONFIRM_PERSON",
                confirm_date,
                sr.final_date
            FROM app_service_request sr
            LEFT JOIN app_employee er ON sr.requestor = er.id
            LEFT JOIN app_item i ON sr.item_id = i.id
            LEFT JOIN app_customer c ON sr.customer = c.id
            LEFT JOIN app_employee ecp ON sr.confirm_person = ecp.id
            WHERE sr.status = 2 AND sr.id IN (
                SELECT f.SERVICE_REQUEST_ID
                FROM app_fill_in f
                INNER JOIN app_employee u ON u.username = '10914191' AND f.dept_id = u.dept_id
                GROUP BY f.SERVICE_REQUEST_ID
            )
            ORDER BY sr.file_date DESC, sr.doc_num DESC;
        `
        SQL:`
            SELECT sr.id,
                '填寫' AS "FILL_IN",
                sr.doc_num,
                sr.file_date,
                er.name AS "REQU_NAME",
                i.name AS "ITEM_NAME",
                c.name AS "CUST_NAME",
                ecp.name AS "CONFIRM_PERSON",
                confirm_date,
                sr.final_date,
                APEX_PAGE.GET_URL(
                    p_page   => 13,
                    p_items  => 'P13_ID,P13_TYPE1_ID,P13_TYPE2_ID,P13_TYPE3_ID',
                    p_values => sr.ID||','||(
                        SELECT id FROM app_fill_in WHERE service_request_id=sr.id AND type=1 AND dept_id=u.dept_id AND ROWNUM=1
                    )||','||(
                        SELECT id FROM app_fill_in WHERE service_request_id=sr.id AND type=2 AND dept_id=u.dept_id AND ROWNUM=1
                    )||','||(
                        SELECT id FROM app_fill_in WHERE service_request_id=sr.id AND type=3 AND dept_id=u.dept_id AND ROWNUM=1
                    )
                ) AS "URL"
            FROM app_service_request sr
            LEFT JOIN app_employee er ON sr.requestor = er.id
            LEFT JOIN app_item i ON sr.item_id = i.id
            LEFT JOIN app_customer c ON sr.customer = c.id
            LEFT JOIN app_employee ecp ON sr.confirm_person = ecp.id
            INNER JOIN app_fill_in f ON sr.id = f.service_request_id
            INNER JOIN app_employee u ON u.username = '10914191' AND f.dept_id = u.dept_id
            WHERE sr.status = 2
            GROUP BY sr.id, sr.doc_num, sr.file_date, er.name, i.name, c.name, ecp.name, confirm_date, sr.final_date, u.dept_id
            ORDER BY sr.file_date DESC, sr.doc_num DESC;
        `
        All* Alignment: Center
        Column Hidden => ID, URL
        Format Mask: YYYY/MM/DD => FILE_DATE, FINAL_DATE, SCHEDULED_DATE, COMPLETION_DATE
        Link(URL): #URL# => FILL_IN


#P9
    Name: 申報單檢視
    Title: 廣穎售後服務 | 檢視
    Edit Breadcrumb: Template Options: Use Compact Style
    Create: Form 品質異常處理單
        Table Name: APP_SERVICE_REQUEST
        -- All* Display Only; Query Only: True; Send On Page Submit: FALSE
        Create: Item Display Only ITEM_NUM
            Send On Page Submit: False
            Default: SQL`
                SELECT item_num FROM app_item WHERE id = :P9_ITEM_ID;
            `
        All* Query Only: True; Read Only/Type: Always
        All* Start New Row False, Exception => REQUESTOR, ITEM_NUM, ITEM_ID, DESCRIPT, CONFIRM_PERSON, RULING_PERSON, RULING_DESCRIPT
        Primary Key, Hidden => ID
        Text Field => DOC_NUM
        Format Mask: YYYY/MM/DD => FILE_DATE, FINAL_DATE, SCHEDULED_DATE, COMPLETION_DATE
        Markdown Editor, , Label: '' => DESCRIPT, RULING_DESCRIPT
        Popup LOV => REQUESTOR, CUSTOMER, ITEM_ID, CONFIRM_PERSON, RULING_PERSON:
            (Display Null Value: False)
            List of Values:
                SELECT name, id FROM app_employee
                SELECT name, id FROM app_customer
                SELECT name, id FROM app_item
                SELECT name, id FROM app_employee WHERE dept_id = 3;
                SELECT name, id FROM app_employee WHERE dept_id = 3;
        Select List => STATUS:
            (Display Null Value: False)
            Static Values:
                待指派, 1
                待回覆, 2
                待裁定, 3
                已解決, 4
        Sub Regions:
            Static Content 料件
                ITEM_NUM, ITEM_NAME
            Reflow Report 料件溯源
                SQL:`
                    SELECT unit_name,
                        doc_num,
                        qty
                    FROM app_item_trace
                    WHERE service_request_id = :P9_ID
                `
            Static Content 異常狀況主訴
                DESCRIPT
            IR 相關附件
                SQL:`
                    SELECT id,
                        attach_filename,
                        attach_lastupd,
                        APEX_UTIL.FILESIZE_MASK(SYS.DBMS_LOB.GETLENGTH(attach)) AS "FILE_SIZE",
                        attach_comments,
                        APEX_UTIL.GET_BLOB_FILE_SRC('P16_ATTACH', id) AS "PREVIEW"
                    FROM app_attachment
                    WHERE service_request_id = :P9_ID
                    ORDER BY attach_filename;
                `
                Page Items to Submit: P9_ID
                Column Hidden => ID
                All* Alignment: Center
                All* Column Alignment: Center, Exception: ATTACH_COMMENTS
                Create: Button Text[Hot] EDIT 上傳
                    Button Position: Edit
                    Link: Page 16; P16_UPLOAD_ID, P16_DOC_NUM; &P9_ID., &P9_DOC_NUM.
                HTML Expression => #PREVIEW#:
                    <img src="#PREVIEW#" onclick="previewImg(this);" onerror="onPreviewError(this);"/>
            Static Content 責任確認
                CONFIRM_DATE, CONFIRM_PERSON, FINAL_DATE
            Reflow Report 原因分析
                SQL:`
                    SELECT d.name dept_name,
                        f.descript,
                        erm.name AS "RESPONSIBLE_MANAGER",
                        erp.name AS "RESPONSIBLE_PERSON",
                        f.scheduled_date,
                        f.completion_date,
                        ec.name AS "CONTACT"
                    FROM app_fill_in f
                    LEFT JOIN app_department d ON f.dept_id = d.id
                    LEFT JOIN app_employee erm ON f.responsible_manager = erm.id
                    LEFT JOIN app_employee erp ON f.responsible_person = erp.id
                    LEFT JOIN app_employee ec ON f.contact = ec.id
                    WHERE f.service_request_id = :P9_ID AND f.type = 1
                `
            Reflow Report 臨時對策
                SQL:`
                    SELECT d.name dept_name,
                        f.descript,
                        erm.name AS "RESPONSIBLE_MANAGER",
                        erp.name AS "RESPONSIBLE_PERSON",
                        f.scheduled_date,
                        f.completion_date
                    FROM app_fill_in f
                    LEFT JOIN app_department d ON f.dept_id = d.id
                    LEFT JOIN app_employee erm ON f.responsible_manager = erm.id
                    LEFT JOIN app_employee erp ON f.responsible_person = erp.id
                    WHERE f.service_request_id = :P9_ID AND f.type = 2
                `
            Reflow Report 再發生防止
                SQL:`
                    SELECT d.name dept_name,
                        f.descript,
                        erm.name AS "RESPONSIBLE_MANAGER",
                        erp.name AS "RESPONSIBLE_PERSON",
                        f.scheduled_date,
                        f.completion_date
                    FROM app_fill_in f
                    LEFT JOIN app_department d ON f.dept_id = d.id
                    LEFT JOIN app_employee erm ON f.responsible_manager = erm.id
                    LEFT JOIN app_employee erp ON f.responsible_person = erp.id
                    WHERE f.service_request_id = :P9_ID AND f.type = 3
                `
            Static Content 裁定
                RULING_PERSON, RULING_RESULT, RULING_DATE, RULING_DESCRIPT
                Markdown Editor, , Label: '', Read Only: Always => RULING_DESCRIPT
                Radio Group => RULING_RESULT
                    Number of Columns: 12
            All* Template: Collapsible
            Start New Row: False => 料件溯源
            Template Options: Remove Body Padding => 異常狀況主訴, 相關附件
            Template Options: Bottom Margin: None => 裁定
        Create: Button Text CANCEL 返回
            Link: Page 2;


#P10
    Name: 申報單建立
    Title: 廣穎售後服務 | 立案
    Edit Breadcrumb: Template Options: Use Compact Style
    Create: Form 品質異常申報單
        SQL: `
            SELECT sr.id, -- default app_service_request_seq.NEXTVAL
                sr.doc_num, -- default PLSQL (this year new number)
                sr.status, -- default 1
                sr.file_date, -- default sysdate
                sr.requestor, -- default SELECT id FROM app_employee WHERE username = :APP_USER
                sr.customer,
                sr.item_id,
                sr.descript
            FROM app_service_request sr
        `
        All* Value Required: True
        Create: Item Display Only ITEM_NUM
            Send On Page Submit: False
        Column Hidden => ID, STATUS
        Primary Key => ID
        Start New Row: False => FILE_DATE, CUSTOMER
        Data Picker, Format Mask: YYYY/MM/DD, Default Expression: SYSDATE => FILE_DATE
        Popup LOV => REQUESTOR, CUSTOMER, ITEM_ID:
            (Display Null Value: False)
            List of Values:
                SELECT name, id FROM app_employee;
                SELECT name, id FROM app_customer;
                SELECT name, id FROM app_item;
        Default REQUESTOR:
            SQL: `
                SELECT id FROM app_employee WHERE username = :APP_USER AND rownum = 1;
            `
        Text Field => DOC_NUM
        Default => DOC_NUM:
            PLSQL:`
                DECLARE
                    l_this_year varchar(4);
                    l_this_year_total number;
                BEGIN
                    l_this_year := to_char(sysdate, 'YYYY');
                    SELECT count(*)+1
                    INTO l_this_year_total
                    FROM app_service_request
                    WHERE FILE_DATE >= to_date(l_this_year || '-01-01', 'yyyy-mm-dd');
                    Return LPAD(l_this_year-1911, 3, '0') || LPAD(l_this_year_total, 3, '0');
                END;
            `
        Markdown Editor, Label: '' => DESCRIPT
        Sub Regions:
            Static Content 料件
                ITEM_NUM, ITEM_ID
            Static Content 料件溯源
                Create:
                    Item Checkbox*4 P10_ITEM_TRACE 課
                        Row CSS Classes: oj-sm-align-items-center
                        Column Span: 2
                    Item Text Field*3 P10_ITEM_TRACE_NUM 單號
                        Start New Row: False
                        Template: Optional
                        Column Span: 6
                        Label Column Span: 2
                    Item Number Field*2 P10_ITEM_TRACE_QTY 數量
                        Start New Row: False
                        Template: Optional
                        Column Span: 4
                        Label Column Span: 1
                        Number Alignment: Left
                    Column CSS Classes: padding-right-sm => P10_ITEM_TRACE3_NUM
                    Label:
                        供應商
                        進料單號
                        生產課
                        領料單號
                        售服課
                        客訴單號
                        設計課
                All* Maintain Session State: Per Request (Memory Only)
            Static Content 異常狀況主訴
                DESCRIPT
            IR 相關附件
                SQL:`
                    SELECT filename,
                        created_on,
                        APEX_UTIL.FILESIZE_MASK(SYS.DBMS_LOB.GETLENGTH(blob_content)) file_size,
                        APEX_UTIL.GET_BLOB_FILE_SRC('P15_TEMP_BLOB', id) preview
                    FROM APEX_APPLICATION_TEMP_FILES
                    WHERE NAME IN (
                        SELECT val FROM (
                            SELECT rownum AS rn, column_value AS val
                            FROM TABLE(apex_string.split(:P15_FILE_BROWSE, ':'))
                        )
                    )
                    ORDER BY filename;
                `
                HTML Expression => #PREVIEW#:
                    <img src="#PREVIEW#" onclick="previewImg(this);" onerror="onPreviewError(this);"/>
            All* Template: Collapsible
            Start New Row: False => 料件溯源
            Template Options: Remove Body Padding => 異常狀況主訴, 相關附件
            Template Options: Bottom Margin: None => 相關附件
            Create: Button Text[Hot] EDIT 上傳
                Button Position: Edit
                Link: Page 15
        Create: Button Text CANCEL 取消
            Link: Page 2;
        Create: Button Text[Hot] CREATE 提交
            Database Action: INSERT


#P11
    Name: 責任確認
P11 confirm
    Title: 廣穎售後服務 | 責任確認
    Edit Breadcrumb: Template Options: Use Compact Style
    P9-Region 品質異常處理單 Copy to Ohter Page..:
        Copy Region Items: Yes, Buttons: No, Sub Regions: Yes
    Create: Process Initialize Handling Form Info
        Execution Options/Point: Before Header
        Type: Form - Initialization
        Form Region: 品質異常處理單
    Edit Region 品質異常處理單:
        Parent Region: - Select - => 責任確認
        Delete Region => 原因分析, 臨時對策, 再發生防止, 裁定
        Template: Collapsible => From 品質異常處理單
        All* Region Template Options: Default State: Collapsed
        Item Hidden, Query Only: False => STATUS
        Computations:
            Item Name: P11_STATUS
            Point: After Header
            Static Value: 2
    Edit Region 責任確認:
        Template: Standard
        All* Value Required: True; Query Only: False; Read Only/Type: - Select -
        Create: Item Hidden DELETE_RESP_ID
            Value Protected: False
        Create: Item Hidden CAN_SUBMIT
            Value Protected: False
        Sub Regions:
            Reflow Report 原因分析, Reflow Report 臨時對策, Reflow Report 再發生防止
                SQL:`
                    SELECT f.id,
                        d.name dept_name,
                        erm.name AS "RESPONSIBLE_MANAGER",
                        '刪除' AS "DELETE"
                    FROM app_fill_in f
                    LEFT JOIN app_department d ON f.dept_id = d.id
                    LEFT JOIN app_employee erm ON f.responsible_manager = erm.id
                    WHERE f.service_request_id = :P11_ID AND f.type = 1
                `
                Page Items to Submit: P11_ID
            All* Template Options: Bottom Margin: None
            All* Start New Row: False
            All* Attributes/Css Classes: resp-confirm
            All* Show: False => #ID#
            All* Link(URL): javascript:void(0), Link Text: &DELETE., Link Attributes: data-id=&ID., Appearance/CSS Classes: delete-resp-link => #DELETE#
            All* Create: Button Text[Hot] EDIT_TYPE? 新增單位
                Button Position: Edit
                Link: Page 12; P12_SERVICE_REQUEST_ID, P12_TYPE; &P11_ID., (1,2,3)
        Create: Button Text CANCEL 取消
            Link: Page 2;
        Create: Button Text[Hot] UPDATE 提交
            Database Action: UPDATE
            Server-side: Item is NOT NULL
                Item: P11_ID
        Computations:
            Item Name: P11_CONFIRM_PERSON
            Point: After Header
            SQL: `SELECT id FROM app_employee WHERE username = :APP_USER`
        Computations:
            Item Name: P11_CONFIRM_DATE
            Point: After Header
            PL/SQL Expression: `SYSDATE`
        Computations:
            Item Name: P11_FINAL_DATE
            Point: After Header
            PL/SQL Expression: `SYSDATE + INTERVAL '10' DAY`


#P12
    Name: 責任指派
    Title: 責任指派
    Create: Form 責任指派
        Table Name: APP_FILL_IN
        Template: Blank with Attributes
        Create: Item Hidden CAN_SUBMIT
            Value Protected: False
        Primary Key => ID
        All* Item Hidden, Expression => TPYE, DEPT_ID, RESPONSIBLE_MANAGER
        Value Required: True => TPYE, DEPT_ID, RESPONSIBLE_MANAGER
        Start New Row: False => RESPONSIBLE_MANAGER
        Read Only/Type: Always => TYPE
        Select List => TYPE
            Type: Shared Component
            List of Values: FILL_IN_TYPE
            Display Null Value: False
        Popup LOV => DEPT_ID, RESPONSIBLE_MANAGER:
            (Display Null Value: False)
            List of Values:
                SELECT name, id FROM app_department
                SELECT name, id FROM app_employee WHERE dept_id = :P12_DEPT_ID AND position = 2
            Parent Items: P12_DEPT_ID => RESPONSIBLE_MANAGER
    Create: Static Content Button
        Template: Buttons Container
        Template Options: Body Padding: Slim Padding
        Create: Button Text CANCEL 取消
        Create: Button Text[Hot] CREATE 提交
            Database Action: INSERT


#P13
    Name: 單位回覆
    Alias: fill-in
    Title: 廣穎售後服務 | 填寫
    Name: 單位回覆
    Edit Breadcrumb: Template Options: Use Compact Style
    P9-Region 品質異常處理單 Copy to Ohter Page..:
        Copy Region Items: Yes, Buttons: Yes, Sub Regions: Yes
    Create: Process Initialize Handling Form Info
        Execution Options/Point: Before Header
        Type: Form - Initialization
        Form Region: 品質異常處理單
    Edit Region 品質異常處理單:
        Delete Region => 原因分析, 臨時對策, 再發生防止, 裁定
        Delete Button => CANCEL
        Template: Collapsible => From 品質異常處理單
        All* Region Template Options: Default State: Collapsed
        Item Hidden, Query Only: False => STATUS
    Create Static Content 單位回覆:
        Sub Regions:
            Form 原因分析, Form 臨時對策, Form 再發生防止
                SQL: `
                    SELECT id AS "TYPE1_ID",
                        dept_id AS "TYPE1_DEPT_ID",
                        responsible_manager AS "TYPE1_RESPONSIBLE_MANAGER",
                        scheduled_date AS "TYPE1_SCHEDULED_DATE",
                        completion_date AS "TYPE1_COMPLETION_DATE",
                        responsible_person AS "TYPE1_RESPONSIBLE_PERSON",
                        contact AS "TYPE1_CONTACT",
                        descript AS "TYPE1_DESCRIPT"
                    FROM app_fill_in
                `
                Item Hidden, Primary Key => ID
                Data Picker, Format Mask: YYYY/MM/DD => SCHEDULED_DATE, COMPLETION_DATE
                Read Only: Always => DEPT_ID, RESPONSIBLE_MANAGER
                Popup LOV => DEPT_ID, RESPONSIBLE_MANAGER, RESPONSIBLE_PERSON, CONTACT:
                    (Display Null Value: False)
                    List of Values:
                        SELECT name, id FROM app_department
                        SELECT name, id FROM app_employee
                Markdown Editor, Label: '' => DESCRIPT
                Start New Row: False => RESPONSIBLE_MANAGER, COMPLETION_DATE, CONTACT
                Value Required: True => RESPONSIBLE_PERSON, CONTACT, DESCRIPT
                Query Only: True => DEPT_ID, RESPONSIBLE_MANAGER
                Server-side:
                    Type: Item is NOT NULL
                    Item: P13_TYPE1_ID
                Computations:
                    Item Name: P13_TYPE1_ID
                    Point: Before Header
                    SQL Query: `
                        SELECT id FROM app_fill_in WHERE service_request_id = :P13_ID AND type = 1 AND dept_id = (SELECT dept_id FROM app_employee WHERE username = '10914191')
                    `
        Create: Button Text CANCEL 取消
            Link: Page 3;
        Create: Button Text[Hot] UPDATE 儲存
            Database Action: UPDATE
            Server-side: Item is NOT NULL
                Item: P13_ID
        Create: Button Text[Hot] SUBMIT 提交
            Database Action: UPDATE
            Server-side: Item is NOT NULL
                Item: P13_ID


#P14
    Name: 裁定
    Alias: ruling
    Title: 廣穎售後服務 | 裁定
    P9-Region 品質異常處理單 Copy to Ohter Page..:
        Copy Region Items: Yes, Buttons: No, Sub Regions: Yes
    Create: Process Initialize Handling Form Info
        Execution Options/Point: Before Header
        Type: Form - Initialization
        Form Region: 品質異常處理單
    Edit Region 品質異常處理單:
        Parent Region: - Select - => 裁定
        Template: Collapsible => From 品質異常處理單
        All* Region Template Options: Default State: Collapsed
        Item Hidden, Query Only: False => STATUS
        Delete Button => 相關附件/EDIT
    Edit Region 裁定:
        Template: Standard
        All* Value Required: True; Query Only: False; Read Only/Type: - Select -
        Create: Button Text CANCEL 取消
            Link: Page 2;
        Create: Button Text[Hot] UPDATE 提交
            Database Action: UPDATE
            Server-side: Item is NOT NULL
                Item: P14_ID


#P15
    Name: 附件上傳 (Temporary)
    Alias: upload-temporary-attachment
    Title: 附件上傳
    Create: Static Content 附件上傳
        Template Options:
            Remove Body Padding
            Header: Hidden
            Style: Remove Borders
            Bottom Margin: None
        Create: Item File Browse FILE_BROWSE
            Display As: Inline Dropzone
            Dropzone Title: 選擇檔案 ...
            Dropzone Description: 選擇或將文件拖放至此
            Allow Multiple Files: True
            Appearance/CSS Classes: padding-none
        Create: Button Text[Hot] CREATE 提交
            Appearance/CSS Classes: margin-top-sm attach-upload-btn
            Database Action: INSERT
            Template Options: Size: Large
    Create: Form 附件檢視元件
        Server-side: Never
        SQL: `
            SELECT ID AS "TEMP_ID",
                BLOB_CONTENT AS "TEMP_BLOB"
            FROM APEX_APPLICATION_TEMP_FILES
        `
        Item Hidden, Primary Key => TEMP_ID
        Item File Browse, Label: '' => TEMP_BLOB
        All* Query Only: True


#P16
    Name: 附件上傳 (Database)
    Alias: upload-attachment
    Title: 附件上傳
    Create: Static Content 附件上傳
        Template Options:
            Remove Body Padding
            Header: Hidden
            Style: Remove Borders
            Bottom Margin: None
        Create: Item Hidden DOC_NUM
        Create: Item Hidden UPLOAD_ID
        Create: Item File Browse FILE_BROWSE
            Display As: Inline Dropzone
            Dropzone Title: 選擇檔案 ...
            Dropzone Description: 選擇或將文件拖放至此
            Allow Multiple Files: True
            Appearance/CSS Classes: padding-none
        Create: Button Text[Hot] CREATE 提交
            Appearance/CSS Classes: margin-top-sm attach-upload-btn
            Database Action: INSERT
            Template Options: Size: Large
    Create: Form 附件檢視元件
        Table Name: APP_ATTACHMENT
        Server-side: Never
        All* Item Hidden, Exception => ATTACH
        Primary Key => ID
        All* Query Only: True