## Page 2
[回首頁][index]

---

### **目錄**
 * [UI](#ui-▲)
 * [Process](#process-▲)
 * [Computation](#computation-▲)
 * [Event](#event-▲)
 * [Branch](#branch-▲)

[top]: #top       "Go Top"
[index]: ./index  "Go Index"

---

#### **# UI** [▲][top]
#### **# Process** [▲][top]
1. Initialize Handling Form Info
   * Identification > Type : Form - Initialization
   * Identification > Form Region : _region_
1. Process form _main_form_automatic_row_processing_dml
   * Identification > Type : Form - Automatic Row Processing (DML)
   * Settings > Return Primary Key(s) after Insert : False
   * Execution Options > Point : Processing
1. Process form 料件溯源 & 附件轉移
   * Identification > Type : Form - Automatic Row Processing (DML)
   * Execution Options > Point : Processing
   * Source > PL/SQL Code :
     ```sql
     ```
#### **# Computation** [▲][top]
1. Item Name: `_item_name_`
   * Execution Options > Point : After Header
   * Computation > Static Value: `_value_`
   * Computation > Type : SQL Query (return single value)
   * Computation > SQL Query :
     ```sql
     ```
   * Computation > PL/SQL Expression: `SYSDATE`
#### **# Event** [▲][top]
1. Refresh Attachment
   * When > Event : Dialog Closed
   * When > Region: _region_
   * *Action*
     1. Refresh
        * Affected Elements > Region: _region_
1. Toggle Item Trace 1 (*3)
   * When > Event : Change
   * When > Items : `_when_item_`
   * *Action*
     1. Disable
        * Affected Elements > Items : `_disable_item_`
        * Execution Options > Fire on Initialization : True
        * Client-side Condition >
          * Type : Item != Value
          * Item : `_client_side_item_`
          * Value : `_client_side_value_`
     1. Enable
        * Affected Elements > Items : `_enable_item_`
        * Client-side Condition >
          * Type : Item = Value
          * Item : `_client_side_item_`
          * Value : `_client_side_value_`

        Affected Elements > Items
        ```
        _item_name_
        ```
#### **# Branch** [▲][top]
1. Goto Page 2
   * Execution Options > Point:After Processing
   * Behavior > Type : Page or URL (Redirect)
   * Behavior > Target > Page: 2










---

### <h3 id="p9"># Page 9 [▲][0]</h3>
#### **Event**
1. Refresh Attachment
   * When > Event : Dialog Closed
   * When > Region: ..相關附件
   * *Action*
     1. Refresh
        * Affected Elements > Region: ..相關附件

### <h3 id="p10"># Page 10 [▲][0]</h3>
#### **Event**
1. Change Item Number
   * When > Event : Change
   * When > Items : `ITEM_ID`
   * *Action*
     1. Set Value
        * Settings > SQL Statement :
          ```sql
          SELECT item_num FROM app_item WHERE id = :P10_ITEM_ID
          ```
        * Settings > Items to Submit : `P10_ITEM_ID`
        * Affected Elements > Items : `P10_ITEM_NUM`
1. Toggle Item Trace 1 (*3)
   * When > Event : Change
   * When > Items : `P10_ITEM_TRACE1`
   * *Action*
     1. Disable
        * Affected Elements > Items : `P10_ITEM_TRACE1_NUM,P10_ITEM_TRACE1_QTY`
        * Execution Options > Fire on Initialization : True
        * Client-side Condition >
          * Type : Item != Value
          * Item : `P10_ITEM_TRACE1`
          * Value : `Y`
     1. Enable
        * Affected Elements > Items : `P10_ITEM_TRACE1_NUM,P10_ITEM_TRACE1_QTY`
        * Client-side Condition >
          * Type : Item = Value
          * Item : `P10_ITEM_TRACE1`
          * Value : `Y`

        Affected Elements > Items
        ```
        P10_ITEM_TRACE1_NUM,P10_ITEM_TRACE1_QTY
        P10_ITEM_TRACE2_NUM,P10_ITEM_TRACE2_QTY
        P10_ITEM_TRACE3_NUM
        ```
        Client-side Condition > Item
        ```
        P10_ITEM_TRACE1
        P10_ITEM_TRACE2
        P10_ITEM_TRACE3
        ```
1. Refresh Attachment
   * When > Event : Dialog Closed
   * When > Region: ..相關附件
   * *Action*
     1. Refresh
        * Affected Elements > Region: ..相關附件
#### **Process**
1. Process form 品質異常申報單
1. Process form 料件溯源 & 附件轉移
   * Source > PL/SQL Code :
     ```sql
     DECLARE
        l_file_count number;
        l_file_names apex_t_varchar2;
     BEGIN
         -- Item Trace
             IF :P10_ITEM_TRACE1 = 'Y' THEN
                 INSERT INTO app_item_trace (id, service_request_id, unit_name, doc_num, qty)
                     VALUES (app_item_trace_seq.NEXTVAL, :P10_ID, '供應商', :P10_ITEM_TRACE1_NUM, :P10_ITEM_TRACE1_QTY);
             END IF;
             IF :P10_ITEM_TRACE2 = 'Y' THEN
                 INSERT INTO app_item_trace (id, service_request_id, unit_name, doc_num, qty)
                     VALUES (app_item_trace_seq.NEXTVAL, :P10_ID, '生產課', :P10_ITEM_TRACE2_NUM, :P10_ITEM_TRACE2_QTY);
             END IF;
             IF :P10_ITEM_TRACE3 = 'Y' THEN
                 INSERT INTO app_item_trace (id, service_request_id, unit_name, doc_num)
                     VALUES (app_item_trace_seq.NEXTVAL, :P10_ID, '售服課', :P10_ITEM_TRACE3_NUM);
             END IF;
             IF :P10_ITEM_TRACE4 = 'Y' THEN
                 INSERT INTO app_item_trace (id, service_request_id, unit_name)
                     VALUES (app_item_trace_seq.NEXTVAL, :P10_ID, '設計課');
             END IF;
         -- Attachment Transfer
         l_file_names := apex_string.split(:P15_FILE_BROWSE, ':');
         IF l_file_names IS NOT NULL THEN
             SELECT count(*)
                 INTO l_file_count
                 FROM APEX_APPLICATION_TEMP_FILES
                 WHERE name IN (
                     SELECT val FROM (
                         SELECT rownum AS rn, column_value AS val FROM TABLE(l_file_names)
                     )
                 );
             IF l_file_count > 0 THEN
                 FOR i IN 1 .. l_file_count LOOP
                     INSERT INTO app_attachment (id, service_request_id, attach, attach_filename, attach_mimetype, attach_lastupd)
                     SELECT app_attachment_seq.NEXTVAL, :P10_ID, BLOB_CONTENT, :P10_DOC_NUM||'_'||i, MIME_TYPE, CREATED_ON
                         FROM APEX_APPLICATION_TEMP_FILES
                         WHERE name = l_file_names(i);
                 END LOOP;
                 DELETE FROM APEX_APPLICATION_TEMP_FILES WHERE name IN (
                     SELECT val FROM (
                         Select rownum AS rn, column_value AS val FROM TABLE(l_file_names)
                     )
                 );
                 COMMIT;
             END IF;
         END IF;
     END;
     ```

### <h3 id="p11"># Page 11 [▲][0]</h3>
#### **Computation**
1. Item Name: `P11_STATUS`
   * Execution Options > Point : After Header
   * Computation > Static Value: `2`
1. Item Name: `P11_CONFIRM_PERSON`
   * Execution Options > Point : After Header
   * Type : SQL Query (return single value)
   * SQL Query :
     ```sql
     SELECT id FROM app_employee WHERE username = :APP_USER
     ```
1. Item Name: `P11_CONFIRM_DATE`
   * Execution Options > Point : After Header
   * PL/SQL Expression: `SYSDATE`
1. Item Name: `P11_FINAL_DATE`
   * Execution Options > Point : After Header
   * PL/SQL Expression: `SYSDATE + INTERVAL '10' DAY`
#### **Event**
1. Delete Respomsible
   * When > Event : Change
   * When > Selection Type : jQuery Selector
   * When > Items : `.delete-resp-link`
   * Advanced > Event Scope : Dynamic
   * *Action*
     1. Set Value
        * Settings > JavaScript Expression :
          ```js
          $(this.triggeringElement).find('a')[0].dataset.id
          ```
        * Affected Elements > Items : `P11_DELETE_RESP_ID`
        * Execution Options > Fire on Initialization : False
     1. Execute Server-side Code
        * Settings > PL/SQL Code :
          ```sql
          DELETE FROM app_fill_in WHERE id = :P11_DELETE_RESP_ID;
          ```
     1. Execute JavaScript Code
        * Settings > Code :
          ```js
          $.event.trigger("refreshAndToggle")
1. Update Respomsible
   * When > Event : Dialog Closed
   * When > Region: 責任確認
   * *Action*
     1. Execute JavaScript Code
        * Settings > Code :
          ```js
          $.event.trigger("refreshAndToggle")
          ```
1. Refresh & Toggle submit
   * When > Event : Custom
   * When > Custom Event : refreshAndToggle
   * When > Selection Type : JavaScript Expression
   * When > JavaScript Expression: document
   * Advanced > Event Scope : Dynamic
   * *Action*
     1. Refresh
        * Affected Elements > jQuery Selector : `.resp-confirm`
     1. Set Value






        > Set Value:
            PLSQL: `
                DECLARE
                    l_exist_qty NUMBER;
                    l_exist_count NUMBER := 0;
                BEGIN
                    FOR i IN 1 .. 3 LOOP
                        SELECT count(*)
                            INTO l_exist_qty
                            FROM app_fill_in
                            WHERE service_request_id = :P11_ID AND type = i;
                        IF l_exist_qty > 0 THEN
                            l_exist_count := l_exist_count + 1;
                        END IF;
                    END LOOP;
                    IF l_exist_count = 3 THEN
                        RETURN 'Y';
                    ELSE
                        RETURN 'N';
                    END IF;
                END;
            `
            Items to Submit: P11_ID
            Affected Elements/Items: P11_CAN_SUBMIT
            Fire on Initialization: True
        > Disable:
            Affected Elements/Button: UPDATE
            Fire on Initialization: True
            Clicke-side: Item != Value
                Item: P11_CAN_SUBMIT
                Value: Y
        > Enable:
            Affected Elements/Button: UPDATE
            Clicke-side: Item = Value
                Item: P11_CAN_SUBMIT
                Value: Y
Process
    Process form Respomsible Confirm
    Branches
        Name: Goto Page 2
        Point: After Processing
        Target: Page: 2



### <h3 id="p10"># Page 10 [▲][0]</h3>
#### **Event**
1. Change Item Number
   * When > Event : Change
   * When > Items : `ITEM_ID`
   * *Action*
     1. Set Value
        * Settings > SQL Statement :
          ```sql
          ```
#P12
Event
    verifySubmit: When P12_RESPONSIBLE_MANAGER Change
        Event Scope: Dynamic
        > Set Value:
            PLSQL: `
                DECLARE
                    l_exist_count number;
                BEGIN
                    SELECT count(*)
                        INTO l_exist_count
                        FROM app_fill_in
                        WHERE service_request_id = :P12_SERVICE_REQUEST_ID AND type = :P12_TYPE AND dept_id = :P12_DEPT_ID;
                    IF  :P12_RESPONSIBLE_MANAGER IS NOT NULL AND l_exist_count = 0 THEN
                        RETURN 'Y';
                    ELSE
                        RETURN 'N';
                    END IF;
                END;
            `
            Items to Submit: P12_SERVICE_REQUEST_ID,P12_TYPE,P12_DEPT_ID,P12_RESPONSIBLE_MANAGER
            Affected Elements/Items: P12_CAN_SUBMIT
            Fire on Initialization: False
        > Disable:
            Affected Elements/Button: CREATE
            Fire on Initialization: True
            Clicke-side: Item != Value
                Item: P12_CAN_SUBMIT
                Value: Y
        > Enable:
            Affected Elements/Button: SUBMIT
            Clicke-side: Item = Value
                Item: P12_CAN_SUBMIT
                Value: Y
    Cancel Dialog:
        Event: Click
        Selection Type: Button
        Button: CANCEL
        > Cancel Dialog
Process
    Process form Respomsible Assign
    Close Dialog
        Server-side:
            Type: Request is contained in Valu
            Value: CREATE


### <h3 id="p10"># Page 10 [▲][0]</h3>
#### **Event**
1. Change Item Number
   * When > Event : Change
   * When > Items : `ITEM_ID`
   * *Action*
     1. Set Value
        * Settings > SQL Statement :
          ```sql
          ```
#P13
Event
After-Submit
    Process form Submission AND Service Request Status
        PL/SQL: `
            DECLARE
                l_totle NUMBER;
                l_has_submitted_count NUMBER;
            BEGIN
                IF :P13_TYPE1_ID IS NOT NULL THEN
                    UPDATE app_fill_in SET has_submitted = 1 WHERE id = :P13_TYPE1_ID;
                END IF;
                IF :P13_TYPE2_ID IS NOT NULL THEN
                    UPDATE app_fill_in SET has_submitted = 1 WHERE id = :P13_TYPE2_ID;
                END IF;
                IF :P13_TYPE2_ID IS NOT NULL THEN
                    UPDATE app_fill_in SET has_submitted = 1 WHERE id = :P13_TYPE3_ID;
                END IF;
                SELECT count(*)
                    INTO l_totle
                    FROM app_fill_in
                    WHERE service_request_id = 8;
                SELECT count(*)
                    INTO l_has_submitted_count
                    FROM app_fill_in
                    WHERE service_request_id = 8
                    AND has_submitted = 1;
                IF l_has_submitted_count = l_totle THEN
                    UPDATE app_service_request SET status = 3 WHERE id = :P13_ID;
                END IF;
            END;
        `
        Server-side: When Button Pressed: SUBMIT
    Branches
        Name: Goto Page 1
        Point: After Processing
        Target: Page: 3
Process
    Process form Fill in type 1
    Process form Fill in type 2
    Process form Fill in type 3

Computations:
    Item Name: P13_TYPE1_ID
    Point: Before Header
    SQL Query: `
        SELECT id FROM app_fill_in WHERE service_request_id = :P13_ID AND type = 1 AND dept_id = (SELECT dept_id FROM app_employee WHERE username = '10914191')


### <h3 id="p10"># Page 10 [▲][0]</h3>
#### **Event**
1. Change Item Number
   * When > Event : Change
   * When > Items : `ITEM_ID`
   * *Action*
     1. Set Value
        * Settings > SQL Statement :
          ```sql
          ```
#P14
Event
    setDefault: Page Load
        > Set Value:
            Static Assignment
                Value: 4
            Affected Elements/Items: P14_STATUS
            Fire on Initialization: True
        > Set Value:
            PLSQL Exception:
                SYSDATE
            Escape Special Characters: False
            Affected Elements/Items: P14_RULING_DATE
            Fire on Initialization: True
Process
    Process form Ruling



### <h3 id="p10"># Page 10 [▲][0]</h3>
#### **Event**
1. Change Item Number
   * When > Event : Change
   * When > Items : `ITEM_ID`
   * *Action*
     1. Set Value
        * Settings > SQL Statement :
          ```sql
          ```
#P15
Event
Process
    Close Dialog
        Server-side:
            Type: Request is contained in Value
            Value: CREATE



### <h3 id="p10"># Page 10 [▲][0]</h3>
#### **Event**
1. Change Item Number
   * When > Event : Change
   * When > Items : `ITEM_ID`
   * *Action*
     1. Set Value
        * Settings > SQL Statement :
          ```sql
          ```
#P16
Event
After-Submit
    Process Attachment Transfer
        PLSQL:`
            DECLARE
                l_file_names APEX_T_VARCHAR2;
                l_file_count NUMBER;
                l_file_current_count NUMBER;
            BEGIN
                -- Attachment Transfer
                l_file_names := apex_string.split(:P16_FILE_BROWSE, ':');
                IF l_file_names IS NOT NULL THEN
                    SELECT count(*)
                        INTO l_file_count
                        FROM APEX_APPLICATION_TEMP_FILES
                        WHERE name IN (
                            SELECT val FROM (
                                SELECT rownum AS rn, column_value AS val FROM TABLE(l_file_names)
                            )
                        );
                    SELECT count(*)
                        INTO l_file_current_count
                        FROM app_attachment
                        WHERE service_request_id = :P16_UPLOAD_ID;
                    IF l_file_count > 0 THEN
                        FOR i IN 1 .. l_file_count LOOP
                            INSERT INTO app_attachment (id, service_request_id, attach, attach_filename, attach_mimetype, attach_lastupd)
                            SELECT app_attachment_seq.NEXTVAL, :P16_UPLOAD_ID, BLOB_CONTENT, :P16_DOC_NUM||'_'||to_char(l_file_current_count+i), MIME_TYPE, CREATED_ON
                                FROM APEX_APPLICATION_TEMP_FILES
                                WHERE name = l_file_names(i);
                        END LOOP;
                        DELETE FROM APEX_APPLICATION_TEMP_FILES WHERE name IN (
                            SELECT val FROM (
                                Select rownum AS rn, column_value AS val FROM TABLE(l_file_names)
                            )
                        );
                        COMMIT;
                    END IF;
                END IF;
            END;
        `
Process
    Close Dialog
        Server-side:
            Type: Request is contained in Value
            Value: CREATE
