"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
var Keywords = [
    'ACCESSIBLE', 'ACTION', 'ADD', 'AFTER', 'AGAINST', 'AGGREGATE', 'ALGORITHM', 'ALL', 'ALTER',
    'ANALYZE', 'AND', 'ANY', 'ASC', 'AS', 'ASCII', 'ASENSITIVE', 'AT', 'AUTHORS', 'AUTOEXTEND_SIZE', 'AUTO_INCREMENT', 'AVG', 'AVG_ROW_LENGTH', 'BACKUP', 'BEFORE', 'BEGIN', 'BETWEEN', 'BIGINT',
    'BINARY', 'BINLOG', 'BIT', 'BLOB', 'BLOCK', 'BOOL', 'BOOLEAN', 'BOTH', 'BTREE', 'BY', 'BYTE', 'CACHE', 'CALL', 'CASCADE', 'CASCADED', 'CASE', 'CATALOG_NAME', 'CHAIN', 'CHANGE', 'CHANGED',
    'CHAR', 'CHARACTER', 'CHARSET', 'CHECK', 'CHECKSUM', 'CIPHER', 'CLASS_ORIGIN', 'CLIENT', 'CLOSE', 'COALESCE', 'CODE', 'COLLATE', 'COLLATION', 'COLUMN', 'COLUMNS', 'COLUMN_NAME',
    'COMMENT', 'COMMIT', 'COMMITTED', 'COMPACT', 'COMPLETION', 'COMPRESSED', 'CONCURRENT', 'CONDITION', 'CONNECTION', 'CONSISTENT', 'CONSTRAINT', 'CONSTRAINT_CATALOG',
    'CONSTRAINT_NAME', 'CONSTRAINT_SCHEMA', 'CONTAINS', 'CONTEXT', 'CONTINUE', 'CONTRIBUTORS', 'CONVERT', 'CPU', 'CREATE', 'CROSS', 'CUBE', 'CURRENT_DATE', 'CURRENT_TIME',
    'CURRENT_TIMESTAMP', 'CURRENT_USER', 'CURSOR', 'CURSOR_NAME', 'DATA', 'DATABASE', 'DATABASES', 'DATAFILE', 'DATE', 'DATETIME', 'DAY', 'DAY_HOUR', 'DAY_MICROSECOND', 'DAY_MINUTE',
    'DAY_SECOND', 'DEALLOCATE', 'DEC', 'DECIMAL', 'DECLARE', 'DEFAULT', 'DEFINER', 'DELAYED', 'DELAY_KEY_WRITE', 'DELETE', 'DESC', 'DESCRIBE', 'DES_KEY_FILE', 'DETERMINISTIC', 'DIRECTORY',
    'DISABLE', 'DISCARD', 'DISK', 'DISTINCT', 'DISTINCTROW', 'DIV', 'DO', 'DOUBLE', 'DROP', 'DUAL', 'DUMPFILE', 'DUPLICATE', 'DYNAMIC', 'EACH', 'ELSE', 'ELSEIF', 'ENABLE', 'ENCLOSED',
    'END', 'ENDS', 'ENGINE', 'ENGINES', 'ENUM', 'ERROR', 'ERRORS', 'ESCAPE', 'ESCAPED', 'EVENT', 'EVENTS', 'EVERY', 'EXECUTE', 'EXISTS', 'EXIT', 'EXPANSION', 'EXPLAIN', 'EXTENDED',
    'EXTENT_SIZE', 'FALSE', 'FAST', 'FAULTS', 'FETCH', 'FIELDS', 'FILE', 'FIRST', 'FIXED', 'FLOAT', 'FLOAT4', 'FLOAT8', 'FLUSH', 'FOR', 'FORCE', 'FOREIGN', 'FOUND', 'FRAC_SECOND', 'FROM', 'FULL', 'FULLTEXT',
    'FUNCTION', 'GENERAL', 'GEOMETRY', 'GEOMETRYCOLLECTION', 'GET_FORMAT', 'GLOBAL', 'GRANT', 'GRANTS', 'GROUP', 'HANDLER', 'HASH', 'HAVING', 'HELP', 'HIGH_PRIORITY', 'HOST',
    'HOSTS', 'HOUR', 'HOUR_MICROSECOND', 'HOUR_MINUTE', 'HOUR_SECOND', 'IDENTIFIED', 'IF', 'IGNORE', 'IGNORE_SERVER_IDS', 'IMPORT', 'IN', 'INDEX', 'INDEXES', 'INFILE', 'INITIAL_SIZE',
    'INNER', 'INNOBASE', 'INNODB', 'INOUT', 'INSENSITIVE', 'INSERT', 'INSERT_METHOD', 'INSTALL', 'INT', 'INT1', 'INT2', 'INT3', 'INT4', 'INT8', 'INTEGER', 'INTERVAL', 'INTO', 'INVOKER',
    'IO', 'IO_THREAD', 'IPC', 'IS', 'ISOLATION', 'ISSUER', 'ITERATE', 'JOIN', 'KEY', 'KEYS', 'KEY_BLOCK_SIZE', 'KILL', 'LANGUAGE', 'LAST', 'LEADING', 'LEAVE', 'LEAVES', 'LEFT', 'LESS', 'LEVEL', 'LIKE',
    'LIMIT', 'LINEAR', 'LINES', 'LINESTRING', 'LIST', 'LOAD', 'LOCAL', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOCK', 'LOCKS', 'LOGFILE', 'LOGS', 'LONG', 'LONGBLOB', 'LONGTEXT', 'LOOP', 'LOW_PRIORITY',
    'MASTER', 'MASTER_CONNECT_RETRY', 'MASTER_HEARTBEAT_PERIOD', 'MASTER_HOST', 'MASTER_LOG_FILE', 'MASTER_LOG_POS', 'MASTER_PASSWORD', 'MASTER_PORT', 'MASTER_SERVER_ID',
    'MASTER_SSL', 'MASTER_SSL_CA', 'MASTER_SSL_CAPATH', 'MASTER_SSL_CERT', 'MASTER_SSL_CIPHER', 'MASTER_SSL_KEY', 'MASTER_SSL_VERIFY_SERVER_CERT', 'MASTER_USER', 'MATCH',
    'MAXVALUE', 'MAX_CONNECTIONS_PER_HOUR', 'MAX_QUERIES_PER_HOUR', 'MAX_ROWS', 'MAX_SIZE', 'MAX_UPDATES_PER_HOUR', 'MAX_USER_CONNECTIONS', 'MEDIUM', 'MEDIUMBLOB',
    'MEDIUMINT', 'MEDIUMTEXT', 'MEMORY', 'MERGE', 'MESSAGE_TEXT', 'MICROSECOND', 'MIDDLEINT', 'MIGRATE', 'MINUTE', 'MINUTE_MICROSECOND', 'MINUTE_SECOND', 'MIN_ROWS',
    'MOD', 'MODE', 'MODIFIES', 'MODIFY', 'MONTH', 'MULTILINESTRING', 'MULTIPOINT', 'MULTIPOLYGON', 'MUTEX', 'MYSQL_ERRNO', 'NAME', 'NAMES', 'NATIONAL', 'NATURAL', 'NCHAR',
    'NDB', 'NDBCLUSTER', 'NEW', 'NEXT', 'NO', 'NODEGROUP', 'NONE', 'NOT', 'NO_WAIT', 'NO_WRITE_TO_BINLOG', 'NULL', 'NUMERIC', 'NVARCHAR', 'OFFSET', 'OLD_PASSWORD', 'ON', 'ONE', 'ONE_SHOT',
    'OPEN', 'OPTIMIZE', 'OPTION', 'OPTIONALLY', 'OPTIONS', 'ORDER', 'OR', 'OUT', 'OUTER', 'OUTFILE', 'OWNER', 'PACK_KEYS', 'PAGE', 'PARSER', 'PARTIAL', 'PARTITION', 'PARTITIONING', 'PARTITIONS',
    'PASSWORD', 'PHASE', 'PLUGIN', 'PLUGINS', 'POINT', 'POLYGON', 'PORT', 'PRECISION', 'PREPARE', 'PRESERVE', 'PREV', 'PRIMARY', 'PRIVILEGES', 'PROCEDURE', 'PROCESSLIST',
    'PROFILE', 'PROFILES', 'PROXY', 'PURGE', 'QUARTER', 'QUERY', 'QUICK', 'RANGE', 'READ', 'READS', 'READ_ONLY', 'READ_WRITE', 'REAL', 'REBUILD', 'RECOVER', 'REDOFILE', 'REDO_BUFFER_SIZE', 'REDUNDANT',
    'REFERENCES', 'REGEXP', 'RELAY', 'RELAYLOG', 'RELAY_LOG_FILE', 'RELAY_LOG_POS', 'RELAY_THREAD', 'RELEASE', 'RELOAD', 'REMOVE', 'RENAME', 'REORGANIZE', 'REPAIR', 'REPEAT', 'REPEATABLE',
    'REPLACE', 'REPLICATION', 'REQUIRE', 'RESET', 'RESIGNAL', 'RESTORE', 'RESTRICT', 'RESUME', 'RETURN', 'RETURNS', 'REVOKE', 'RIGHT', 'RLIKE', 'ROLLBACK', 'ROLLUP', 'ROUTINE', 'ROW', 'ROWS',
    'ROW_FORMAT', 'RTREE', 'SAVEPOINT', 'SCHEDULE', 'SCHEMA', 'SCHEMAS', 'SCHEMA_NAME', 'SECOND', 'SECOND_MICROSECOND', 'SECURITY', 'SELECT', 'SENSITIVE', 'SEPARATOR', 'SERIAL', 'SERIALIZABLE',
    'SERVER', 'SESSION', 'SET', 'SHARE', 'SHOW', 'SHUTDOWN', 'SIGNAL', 'SIGNED', 'SIMPLE', 'SLAVE', 'SLOW', 'SMALLINT', 'SNAPSHOT', 'SOCKET', 'SOME', 'SONAME', 'SOUNDS', 'SOURCE',
    'SPATIAL', 'SPECIFIC', 'SQL', 'SQLEXCEPTION', 'SQLSTATE', 'SQLWARNING', 'SQL_BIG_RESULT', 'SQL_BUFFER_RESULT', 'SQL_CACHE', 'SQL_CALC_FOUND_ROWS', 'SQL_NO_CACHE',
    'SQL_SMALL_RESULT', 'SQL_THREAD', 'SQL_TSI_DAY', 'SQL_TSI_FRAC_SECOND', 'SQL_TSI_HOUR', 'SQL_TSI_MINUTE', 'SQL_TSI_MONTH', 'SQL_TSI_QUARTER', 'SQL_TSI_SECOND', 'SQL_TSI_WEEK',
    'SQL_TSI_YEAR', 'SSL', 'START', 'STARTING', 'STARTS', 'STATUS', 'STOP', 'STORAGE', 'STRAIGHT_JOIN', 'STRING', 'SUBCLASS_ORIGIN', 'SUBJECT', 'SUBPARTITION', 'SUBPARTITIONS', 'SUPER',
    'SUSPEND', 'SWAPS', 'SWITCHES', 'TABLE', 'TABLES', 'TABLESPACE', 'TABLE_CHECKSUM', 'TABLE_NAME', 'TEMPORARY', 'TEMPTABLE', 'TERMINATED', 'TEXT', 'THAN', 'THEN', 'TIME',
    'TIMESTAMP', 'TIMESTAMPADD', 'TIMESTAMPDIFF', 'TINYBLOB', 'TINYINT', 'TINYTEXT', 'TO', 'TRAILING', 'TRANSACTION', 'TRIGGER', 'TRIGGERS', 'TRUE', 'TRUNCATE', 'TYPE', 'TYPES',
    'UNCOMMITTED', 'UNDEFINED', 'UNDO', 'UNDOFILE', 'UNDO_BUFFER_SIZE', 'UNICODE', 'UNINSTALL', 'UNION', 'UNIQUE', 'UNKNOWN', 'UNLOCK', 'UNSIGNED', 'UNTIL', 'UPDATE', 'UPGRADE',
    'USAGE', 'USE', 'USER', 'USER_RESOURCES', 'USE_FRM', 'USING', 'UTC_DATE', 'UTC_TIME', 'UTC_TIMESTAMP', 'VALUE', 'VALUES', 'VARBINARY', 'VARCHAR', 'VARCHARACTER', 'VARIABLES',
    'VARYING', 'VIEW', 'WAIT', 'WARNINGS', 'WEEK', 'WHEN', 'WHERE', 'WHILE', 'WITH', 'WORK', 'WRAPPER', 'WRITE', 'X509', 'XA', 'XML', 'XOR', 'YEAR', 'YEAR_MONTH', 'ZEROFILL'
];
var Functions = [
    'ABS\\(', 'ACOS\\(', 'ADDDATE\\(', 'ADDTIME\\(', 'AES_DECRYPT\\(', 'AES_ENCRYPT\\(', 'ANY_VALUE\\(', 'ASCII\\(', 'ASIN\\(', 'ASYMMETRIC_DECRYPT\\(', 'ASYMMETRIC_DERIVE\\(', 'ASYMMETRIC_ENCRYPT\\(',
    'ASYMMETRIC_SIGN\\(', 'ASYMMETRIC_VERIFY\\(', 'ATAN\\(', 'ATAN2\\(, ATAN\\(', 'AVG\\(', 'BENCHMARK\\(', 'BIN\\(', 'BIT_AND\\(', 'BIT_COUNT\\(', 'BIT_LENGTH\\(', 'BIT_OR\\(', 'BIT_XOR\\(', 'CAST\\(',
    'CEIL\\(', 'CEILING\\(', 'CHAR\\(', 'CHAR_LENGTH\\(', 'CHARACTER_LENGTH\\(', 'CHARSET\\(', 'COALESCE\\(', 'COERCIBILITY\\(', 'COLLATION\\(', 'COMPRESS\\(', 'CONCAT\\(', 'CONCAT_WS\\(',
    'CONNECTION_ID\\(', 'CONV\\(', 'CONVERT\\(', 'CONVERT_TZ\\(', 'COS\\(', 'COT\\(', 'COUNT\\(', 'CRC32\\(', 'CREATE_ASYMMETRIC_PRIV_KEY\\(', 'CREATE_ASYMMETRIC_PUB_KEY\\(',
    'CREATE_DH_PARAMETERS\\(', 'CREATE_DIGEST\\(', 'CURDATE\\(', 'CURRENT_DATE\\(', 'CURRENT_TIME\\(', 'CURRENT_TIMESTAMP\\(', 'CURRENT_USER\\(', 'CURTIME\\(', 'DATABASE\\(', 'DATE\\(', 'DATE_ADD\\(',
    'DATE_FORMAT\\(', 'DATE_SUB\\(', 'DATEDIFF\\(', 'DAY\\(', 'DAYNAME\\(', 'DAYOFMONTH\\(', 'DAYOFWEEK\\(', 'DAYOFYEAR\\(', 'DECODE\\(', 'DEFAULT\\(', 'DEGREES\\(', 'ELT\\(', 'ENCODE\\(', 'EXP\\(',
    'EXPORT_SET\\(', 'EXTRACT\\(', 'ExtractValue\\(', 'FIELD\\(', 'FIND_IN_SET\\(', 'FLOOR\\(', 'FORMAT\\(', 'FOUND_ROWS\\(', 'FROM_BASE64\\(', 'FROM_DAYS\\(', 'FROM_UNIXTIME\\(', 'GeometryCollection\\(',
    'GET_FORMAT\\(', 'GET_LOCK\\(', 'GREATEST\\(', 'GROUP_CONCAT\\(', 'GTID_SUBSET\\(', 'GTID_SUBTRACT\\(', 'HEX\\(', 'HOUR\\(', 'IF\\(', 'IFNULL\\(', 'IN\\(', 'INET_ATON\\(', 'INET_NTOA\\(', 'INET6_ATON\\(',
    'INET6_NTOA\\(', 'INSERT\\(', 'INSTR\\(', 'INTERVAL\\(', 'IS_FREE_LOCK\\(', 'IS_IPV4\\(', 'IS_IPV4_COMPAT\\(', 'IS_IPV4_MAPPED\\(', 'IS_IPV6\\(', 'IS_USED_LOCK\\(', 'ISNULL\\(', 'JSON_APPEND\\(',
    'JSON_ARRAY\\(', 'JSON_ARRAY_APPEND\\(', 'JSON_ARRAY_INSERT\\(', 'JSON_CONTAINS\\(', 'JSON_CONTAINS_PATH\\(', 'JSON_DEPTH\\(', 'JSON_EXTRACT\\(', 'JSON_INSERT\\(', 'JSON_KEYS\\(', 'JSON_LENGTH\\(',
    'JSON_MERGE\\(', 'JSON_OBJECT\\(', 'JSON_QUOTE\\(', 'JSON_REMOVE\\(', 'JSON_REPLACE\\(', 'JSON_SEARCH\\(', 'JSON_SET\\(', 'JSON_TYPE\\(', 'JSON_UNQUOTE\\(', 'JSON_VALID\\(', 'LAST_INSERT_ID\\(',
    'LCASE\\(', 'LEAST\\(', 'LEFT\\(', 'LENGTH\\(', 'LineString\\(', 'LN\\(', 'LOAD_FILE\\(', 'LOCALTIME\\(', 'LOCALTIMESTAMP\\(', 'LOCATE\\(', 'LOG\\(', 'LOG10\\(', 'LOG2\\(', 'LOWER\\(', 'LPAD\\(', 'LTRIM\\(',
    'MAKE_SET\\(', 'MAKEDATE\\(', 'MAKETIME\\(', 'MASTER_POS_WAIT\\(', 'MAX\\(', 'MBRContains\\(', 'MBRCoveredBy\\(', 'MBRCovers\\(', 'MBRDisjoint\\(', 'MBREquals\\(', 'MBRIntersects\\(', 'MBROverlaps\\(',
    'MBRTouches\\(', 'MBRWithin\\(', 'MD5\\(', 'MICROSECOND\\(', 'MID\\(', 'MIN\\(', 'MINUTE\\(', 'MOD\\(', 'MONTH\\(', 'MONTHNAME\\(', 'MultiLineString\\(', 'MultiPoint\\(', 'MultiPolygon\\(', 'NAME_CONST\\(',
    'NOT IN\\(', 'NOT LIKE', 'NOW\\(', 'NULLIF\\(', 'OCT\\(', 'OCTET_LENGTH\\(', 'OLD_PASSWORD\\(', 'ORD\\(', 'PERIOD_ADD\\(', 'PERIOD_DIFF\\(', 'PI\\(', 'Point\\(', 'Polygon\\(', 'POSITION\\(', 'POW\\(',
    'POWER\\(', 'PROCEDURE ANALYSE\\(', 'QUARTER\\(', 'QUOTE\\(', 'RADIANS\\(', 'RAND\\(', 'RANDOM_BYTES\\(', 'RELEASE_ALL_LOCKS\\(', 'RELEASE_LOCK\\(', 'REPEAT\\(', 'REPLACE\\(', 'REVERSE\\(', 'RIGHT\\(',
    'ROUND\\(', 'ROW_COUNT\\(', 'RPAD\\(', 'RTRIM\\(', 'SCHEMA\\(', 'SEC_TO_TIME\\(', 'SECOND\\(', 'SESSION_USER\\(', 'SHA1\\(', 'SHA\\(', 'SHA2\\(', 'SIGN\\(', 'SIN\\(', 'SLEEP\\(', 'SOUNDEX\\(', 'SPACE\\(',
    'SQRT\\(', 'ST_Area\\(', 'ST_AsBinary\\(', 'ST_AsGeoJSON\\(', 'ST_AsText\\(', 'ST_Buffer\\(', 'ST_Buffer_Strategy\\(', 'ST_Centroid\\(', 'ST_Contains\\(', 'ST_ConvexHull\\(', 'ST_Crosses\\(',
    'ST_Difference\\(', 'ST_Dimension\\(', 'ST_Disjoint\\(', 'ST_Distance\\(', 'ST_Distance_Sphere\\(', 'ST_EndPoint\\(', 'ST_Envelope\\(', 'ST_Equals\\(', 'ST_ExteriorRing\\(', 'ST_GeoHash\\(',
    'ST_GeomCollFromText\\(', 'ST_GeometryCollectionFromText\\(', 'ST_GeomCollFromTxt\\(', 'ST_GeomCollFromWKB\\(', 'ST_GeometryCollectionFromWKB\\(', 'ST_GeometryN\\(', 'ST_GeometryType\\(',
    'ST_GeomFromGeoJSON\\(', 'ST_GeomFromText\\(', 'ST_GeometryFromText\\(', 'ST_GeomFromWKB\\(', 'ST_GeometryFromWKB\\(', 'ST_InteriorRingN\\(', 'ST_Intersection\\(', 'ST_Intersects\\(',
    'ST_IsClosed\\(', 'ST_IsEmpty\\(', 'ST_IsSimple\\(', 'ST_IsValid\\(', 'ST_LatFromGeoHash\\(', 'ST_Length\\(', 'ST_LineFromText\\(', 'ST_LineStringFromText\\(', 'ST_LineFromWKB\\(',
    'ST_LineStringFromWKB\\(', 'ST_LongFromGeoHash\\(', 'ST_MakeEnvelope\\(', 'ST_MLineFromText\\(', 'ST_MultiLineStringFromText\\(', 'ST_MLineFromWKB\\(', 'ST_MultiLineStringFromWKB\\(',
    'ST_MPointFromText\\(', 'ST_MultiPointFromText\\(', 'ST_MPointFromWKB\\(', 'ST_MultiPointFromWKB\\(', 'ST_MPolyFromText\\(', 'ST_MultiPolygonFromText\\(', 'ST_MPolyFromWKB\\(',
    'ST_MultiPolygonFromWKB\\(', 'ST_NumGeometries\\(', 'ST_NumInteriorRing\\(', 'ST_NumInteriorRings\\(', 'ST_NumPoints\\(', 'ST_Overlaps\\(', 'ST_PointFromGeoHash\\(', 'ST_PointFromText\\(',
    'ST_PointFromWKB\\(', 'ST_PointN\\(', 'ST_PolyFromText\\(', 'ST_PolygonFromText\\(', 'ST_PolyFromWKB\\(', 'ST_PolygonFromWKB\\(', 'ST_Simplify\\(', 'ST_SRID\\(', 'ST_StartPoint\\(',
    'ST_SymDifference\\(', 'ST_Touches\\(', 'ST_Union\\(', 'ST_Validate\\(', 'ST_Within\\(', 'ST_X\\(', 'ST_Y\\(', 'STD\\(', 'STDDEV\\(', 'STDDEV_POP\\(', 'STDDEV_SAMP\\(', 'STR_TO_DATE\\(', 'STRCMP\\(',
    'SUBDATE\\(', 'SUBSTR\\(', 'SUBSTRING\\(', 'SUBSTRING_INDEX\\(', 'SUBTIME\\(', 'SUM\\(', 'SYSDATE\\(', 'SYSTEM_USER\\(', 'TAN\\(', 'TIME\\(', 'TIME_FORMAT\\(', 'TIME_TO_SEC\\(', 'TIMEDIFF\\(',
    'TIMESTAMP\\(', 'TIMESTAMPADD\\(', 'TIMESTAMPDIFF\\(', 'TO_BASE64\\(', 'TO_DAYS\\(', 'TO_SECONDS\\(', 'TRIM\\(', 'TRUNCATE\\(', 'UCASE\\(', 'UNCOMPRESS\\(', 'UNCOMPRESSED_LENGTH\\(', 'UNHEX\\(',
    'UNIX_TIMESTAMP\\(', 'UpdateXML\\(', 'UPPER\\(', 'USER\\(', 'UTC_DATE\\(', 'UTC_TIME\\(', 'UTC_TIMESTAMP\\(', 'UUID\\(', 'UUID_SHORT\\(', 'VALIDATE_PASSWORD_STRENGTH\\(', 'VALUES\\(', 'VAR_POP\\(',
    'VAR_SAMP\\(', 'VARIANCE\\(', 'VERSION\\(', 'WAIT_FOR_EXECUTED_GTID_SET\\(', 'WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS\\(', 'WEEK\\(', 'WEEKDAY\\(', 'WEEKOFYEAR\\(', 'WEIGHT_STRING\\(', 'YEAR\\(', 'YEARWEEK\\('
];
var mysqlSpaceRegExSnippet = '(?: |\t|\r\n|\r|\n)'; // VSCode doesn't handle the \s meta-character. The \r\n permutations are to handle linefeeds in Windows, Mac & Linux respectively
var mysqlKeywordRegEx = new RegExp(mysqlSpaceRegExSnippet + "(?:" + Keywords.join('|') + ")" + mysqlSpaceRegExSnippet, "gi");
var mysqlFunctionRegEx = new RegExp("(?: " + Functions.join('|') + " )", "gi");
var mysqlStringRegEx = /'(([^'])*)'/gi;
var mysqlParamRegEx = /\?/gi;
// this method is called when vs code is activated
function activate(context) {
    // create a decorator type that we use to decorate large numbers
    var KeywordDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#569CD6'
    });
    var ParamDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#FF0000'
    });
    var StringDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#d69d85'
    });
    var FunctionDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#FF00FF'
    });
    var NoneDecorationType = vscode.window.createTextEditorDecorationType({
        color: '#FFFFFF'
    });
    var activeEditor = vscode.window.activeTextEditor, currentFileExtention = '';
    if (activeEditor) {
        currentFileExtention = getFileExtention(activeEditor);
        triggerUpdateDecorations(activeEditor);
    }
    vscode.window.onDidChangeActiveTextEditor(function (editor) {
        activeEditor = editor;
        if (editor) {
            currentFileExtention = getFileExtention(activeEditor);
            triggerUpdateDecorations(activeEditor);
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(function (event) {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations(activeEditor);
        }
    }, null, context.subscriptions);
    var timeout = null;
    function triggerUpdateDecorations(activeEditor) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(updateDecorations, 150);
    }
    function getFileExtention(activeEditor) {
        return activeEditor.document.fileName.substring(activeEditor.document.fileName.lastIndexOf('.') + 1, activeEditor.document.fileName.length);
    }
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        console.log(currentFileExtention);
        if (currentFileExtention === 'json') {
            return;
        }
        var regEx = /`(([^`]|\n)*)`/g;
        var text = activeEditor.document.getText();
        var largeNumbers = [];
        var match;
        var wKeywords = [];
        var wFunctions = [];
        var wStrings = [];
        var wParams = [];
        var wNone = [];
        while (match = regEx.exec(text)) {
            var wKeywordFound = findInMatch(match, mysqlKeywordRegEx);
            var wFunctionFound = findInMatch(match, mysqlFunctionRegEx, -1);
            //at least 2 keywords found
            if ((wKeywordFound.length + wFunctionFound.length) > 1) {
                var startPos = activeEditor.document.positionAt(match.index);
                var endPos = activeEditor.document.positionAt(match.index + match[0].length);
                var decoration = new vscode.Range(startPos, endPos);
                var wStringFound = findInMatch(match, mysqlStringRegEx);
                var wParamsFound = findInMatch(match, mysqlParamRegEx);
                wKeywords.push.apply(wKeywords, wKeywordFound);
                wFunctions.push.apply(wFunctions, wFunctionFound);
                wStrings.push.apply(wStrings, wStringFound);
                wParams.push.apply(wParams, wParamsFound);
                wNone.push(decoration);
            }
        }
        activeEditor.setDecorations(NoneDecorationType, wNone);
        activeEditor.setDecorations(ParamDecorationType, wParams);
        activeEditor.setDecorations(StringDecorationType, wStrings);
        activeEditor.setDecorations(KeywordDecorationType, wKeywords);
        activeEditor.setDecorations(FunctionDecorationType, wFunctions);
    }
    function findInMatch(iMatch, iRegExp, iAdjustment) {
        var stringFound = [];
        var match;
        while (match = iRegExp.exec(iMatch[0])) {
            var startPos = activeEditor.document.positionAt(match.index + iMatch.index);
            var endPos = activeEditor.document.positionAt(match.index + match[0].length + iMatch.index + Number(iAdjustment || 0));
            var decoration = new vscode.Range(startPos, endPos);
            stringFound.push(decoration);
        }
        return stringFound;
    }
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map