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




DECLARE @C VARCHAR(30)
EXECUTE PROC_CHECK_INPUT_INSERT '19','ReJobFullStack','RJ District','RJ@gmail.com','05-10-1999','05-10-2020', 1,2,'NOTHING',@C OUTPUT
SELECT * FROM dbo.Recruitment_Job


SELECT * FROM dbo.Recruitment_Job

PRINT ((SELECT COUNT(JTimeStart) FROM dbo.Recruitment_Job as RJ WHERE RJ.JTimeEnd_Expected < RJ.JTimeStart ) = 1)

SELECT IDENT_CURRENT('Account')
INSERT INTO Account VALUES('a','a',1)
	
SELECT * FROM Account
SELECT * FROM dbo.Business_type
SELECT * FROM Candidate
SELECT * FROM Employer
SELECT * FROM dbo.Recruitment_Job

DELETE dbo.Recruitment_Job where JID = 23

INSERT INTO dbo.Employer VALUES( (SELECT IDENT_CURRENT('Account')),'${req.body.username}','NULL','NULL',1)