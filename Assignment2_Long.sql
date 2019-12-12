
-- Phần này là của long nhé
use R_System
go
SELECT * FROM Employer
SELECT * FROM Recruitment_Job
SELECT * FROM Curriculum_Vitae



--------------------------------------------------------------------------------------------------------------------------------------
-- Câu 1:
-- INSERT dữ liệu vào một bảng dữ liệu với các tham số cần thiết, có VALIDATE giá trị truyền
-- và hiển thị thông báo lỗi có nghĩa.
DROP PROC PROC_CHECK_INPUT_INSERT
CREATE PROCEDURE PROC_CHECK_INPUT_INSERT
@EID VARCHAR(10),@Name NVARCHAR(MAX),@Address NVARCHAR(MAX),@Insurance NVARCHAR(MAX),@TStart DATE
,@Tend DATE,@Salary VARCHAR(MAX),@Doff VARCHAR(MAX),@Description NVARCHAR(MAX),@Check VARCHAR(30) OUTPUT
AS
BEGIN
	IF ISNUMERIC(@Salary) = 0 or ISNUMERIC(@Doff) = 0
	BEGIN 
		SELECT @Check = 0
		PRINT 'FAILED: TYPE FORMAT IS NOT MATCH' 
		RETURN
	END
	IF @Salary < 0 or @Doff < 0 
	BEGIN 
		SELECT @Check = 0
		PRINT 'FAILED: DATA VALUE IS INVALID' 
		RETURN
	END
	INSERT INTO dbo.Recruitment_Job VALUES(@EID,@Name,@Address,@Insurance,@TStart,@Tend,@Salary,@Doff,@Description)
	SELECT @Check = 0
	PRINT 'SUCCESS'
END
delete dbo.Recruitment_Job WHERE JID = 'RJ_ID11'
DECLARE @CHECK VARCHAR(30);
EXECUTE PROC_CHECK_INPUT_INSERT '19','ReJobFullStack','RJ District','RJ@gmail.com','05-10-1999','05-10-2020',10,2,'NOTHING',@CHECK OUTPUT
--SELECT TOP 1 * FROM table_Name ORDER BY unique_column DESC 
--------------------------------------------------------------------------------------------------------------------------------------
-- Câu 2
-- Viết 2 trigger kiểm soát insert, update, delete trên bảng đã tạo.
DROP TRIGGER RJ_trigger_iu
-- BEFORE INSERT 
CREATE TRIGGER RJ_trigger_iu On Recruitment_Job
FOR INSERT, UPDATE
AS
BEGIN
	IF ((SELECT JSalary from inserted where JSalary < 0) is not Null)
		BEGIN
		PRINT 'FAILED: DATA VALUE IS INVALID' 
		ROLLBACK TRAN 
		END
	ELSE 
		BEGIN
		IF ( exists (SELECT* FROM dbo.Recruitment_Job as RJ WHERE RJ.JTimeEnd_Expected < RJ.JTimeStart ))
			BEGIN
			PRINT 'FAILED: START TIME IS GREATER THAN END TIME'
			ROLLBACK TRAN
			END
		ELSE
			PRINT 'SUCCESS'
		END
END;


-- AFTER DELETE, REMOVE Curiculum Vitage (CHANGE ANOTHER TABLES)
CREATE TRIGGER RJ_trigger_d ON Recruitment_Job
AFTER DELETE
AS
BEGIN
	DELETE FROM Curriculum_Vitae WHERE CVC_RJID =  (SELECT J_EID FROM deleted);
END;

------------------------------------------------------------------------------------------------------------------------------------
-- Câu 3
-- Viết 2 thủ tục chỉ chứa câu truy vấn để hiển thị dữ liệu và tham số đầu vào

-- a

DROP PROCEDURE SELECT_JOIN_EM_RJ

CREATE PROCEDURE SELECT_JOIN_EM_RJ
@Data VARCHAR(MAX)
AS 
BEGIN
IF ISNUMERIC(@Data) = 0 BEGIN PRINT 'FAILED: ID must be INTERGER' END
ELSE SELECT EName,JDescription,JTimeStart,JTimeEnd_Expected,JSalary  FROM Recruitment_Job, Employer WHERE EID = @Data and J_EID = @Data
END

EXEC SELECT_JOIN_EM_RJ '19'


-- b

DROP PROCEDURE SELECT_JOIN_MAX_SAL


CREATE PROCEDURE SELECT_JOIN_MAX_SAL
@Data VARCHAR(MAX)
AS
BEGIN
IF ISNUMERIC(@Data) = 0 BEGIN PRINT 'FAILED: Salary must be INTERGER' END
ELSE SELECT J_EID as 'Root Jobs', MAX(RJ.JSalary) as 'Max Salary'  FROM Recruitment_Job as RJ Group By J_EID HAVING MAX(RJ.JSalary)> @Data
END


EXECUTE SELECT_JOIN_MAX_SAL '1005'




------------------------------------------------------------------------------------------------------------------------------------
-- Câu 4
-- Viết 2 hàm thỏa yêu cầu.
-- Function 1: Kiểm tra các Job có mức lương sơ bộ cao hơn Tham số truyền (SalIn)
DROP FUNCTION UF_RJ_GOE_Salary
CREATE FUNCTION UF_RJ_GOE_Salary(@Salary INT)
RETURNS @Data TABLE (ID VARCHAR(10),Salary INT)
AS 
BEGIN
	IF (@Salary > 0 )
	BEGIN INSERT INTO @Data SELECT RJ.J_EID, RJ.JSalary From dbo.Recruitment_Job as RJ WHERE RJ.JSalary > @Salary
	END
	ELSE
	BEGIN 
	INSERT INTO @Data VALUES('-1',-1)
	END
	RETURN
END


-- Function 2: Tìm công việc nào có thời gian làm việc lớn hơn hoặc bằng @Years năm.
------------------------------------------------------------------------------------------------------------------------------------------
DROP FUNCTION UF_RJ_WT_GOE_YEARs
CREATE FUNCTION UF_RJ_WT_GOE_YEARs(@Years INT)
RETURNS @table TABLE (ID VARCHAR(10))
AS
BEGIN
	IF (@Years < 0) BEGIN INSERT @table VALUES (-1) END
	ELSE 
	BEGIN 
	INSERT INTO @table SELECT JID from dbo.Recruitment_Job as RJ WHERE  YEAR(RJ.JTimeStart) - YEAR(RJ.JTimeEnd_Expected) >= @Years
	END
	RETURN
END


-- Câu lệnh SELECT 
-----------------------------------------------------------------------------------------------------------------------------------------


SELECT ID ,MAX(Salary) as 'Salary' FROM dbo.UF_RJ_GOE_Salary(1000) GROUP BY ID -- Function 1



SELECT * FROM dbo.Recruitment_Job INNER JOIN dbo.UF_RJ_WT_GOE_YEARs(0) ON ID = JID -- Function 2