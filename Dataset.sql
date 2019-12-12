USE  R_System
GO


DECLARE @cnt INT = 1;
DECLARE @cnt_total INT = 30;

--INSERT DATA -> ACCOUNT
WHILE @cnt <= @cnt_total/2
BEGIN
	INSERT INTO Account VALUES(CONCAT('candidate',@cnt,'@gmail.com'),CONCAT('candidate',@cnt),0)
	SET @cnt = @cnt + 1;
END;
SET @cnt = @cnt_total/2+1
WHILE @cnt <= @cnt_total
BEGIN
INSERT INTO Account VALUES(CONCAT('employer',@cnt,'@gmail.com'),CONCAT('employer',@cnt),1)
	SET @cnt = @cnt + 1;
END;	

SET @cnt_total = 15;
SET @cnt = 1;
--INSERT DATA -> EMPLOYER
INSERT INTO Business_type VALUES ('NOT SET YET1', 'NOT SET YET1');
INSERT INTO Business_type VALUES ('NOT SET YET2', 'NOT SET YET2');
INSERT INTO Business_type VALUES ('NOT SET YET3', 'NOT SET YET3');


WHILE @cnt <= @cnt_total/2
BEGIN
	INSERT INTO Candidate 
	VALUES(
	@cnt,
	CONCAT('CANDIDATE',@cnt), -- CFName
	CONCAT('CANDIDATE',@cnt,' District'), -- CAddress
	CONCAT('123456789',@cnt),-- CContact
	CONCAT('CANDIDATE',@cnt,'@hcmut.edu.vn'), -- CEmail
	CONCAT('05-',@cnt,'-1999'), -- CDOB
	0, -- Secure
	RAND(1), -- SeX
	'Computer Science') -- Spe2cialize
	SET @cnt = @cnt + 1;
END;
SET @cnt = 1;

SET @cnt_total=30
SET @cnt = @cnt_total/2+1
WHILE @cnt <= @cnt_total
	BEGIN
	INSERT INTO Employer VALUES(@cnt,CONCAT('NAME is EMPLOYER',@cnt),CONCAT('EMPLOYER',@cnt,'@hcmut.edu.vn'),CONCAT('EMPLOYER',@cnt,' District'),1+@cnt%3);
	SET @cnt = @cnt + 1;
END;
SET @cnt = 1;

SET @cnt_total = 9;
WHILE @cnt <= @cnt_total
	BEGIN
	INSERT INTO Recruitment_Job VALUES(
	@cnt+15, -- Job Employer raise ID
	CONCAT('Job Name ',@cnt), -- Job Name
	CONCAT('Address Job ',10+@cnt), -- Job Address
	CONCAT('Job Insurance',@cnt), -- Job Insurance
	CONCAT('05-',@cnt,'-2019'), -- Job StartTime
	CONCAT('11-',@cnt,'-2019'), -- Job EndTime
	1000+@cnt,			-- Job Salary
	365,				-- Job Day off per Year
	CONCAT('Description ',@cnt) -- Job Description
	);
	SET @cnt = @cnt + 1;
END;

SET @cnt_total = 15;
SET @cnt = 1;
WHILE @cnt <= @cnt_total
	BEGIN
	INSERT INTO Curriculum_Vitae VALUES(
	@cnt%2 + 2,	-- CV Root Job ID
	@cnt%3 +  2,		-- CV Candidate ID
	CONCAT('Edu ',@cnt),	-- CV Education
	CONCAT('A Level ',@cnt),	-- CV Academic
	CONCAT('Foreign ',@cnt),	-- CV Foreign Languages
	CONCAT('Exp= ',@cnt),	-- CV Expreience
	CONCAT('Health ',@cnt),	-- CV Health
	@cnt,	-- CV Candidate
	@cnt,	-- CV Candidate
	@cnt,	-- CV Candidate
	10.05+@cnt	-- CV Candidate
	);
	SET @cnt = @cnt + 1;
END;
SET @cnt = 1;

--WHILE @cnt <= @cnt_total
--	BEGIN
--	INSERT INTO Blog VALUES(
--	CONCAT('CND',@cnt),	-- Author ID
--	CONCAT('Author',@cnt),
--	CONCAT('BLG',@cnt),		-- Blog ID
--	CONCAT('BLG Name ',@cnt),	-- Blog Name
--	'BLOG'
--	);
--	SET @cnt = @cnt + 1;
--END;



select * from Employer -- Linh hy
select * from Account
select * from Business_type -- Tuấn
select * from Candidate -- Huy
select * from Recruitment_Job -- Long
select * from Curriculum_Vitae -- Đệ
select * from Blog