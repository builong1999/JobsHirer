USE master ;
DROP DATABASE R_System
GO

CREATE DATABASE R_System
GO
USE R_System
-- ASSIGNMENT 2, CREATE DATABASE

CREATE TABLE Account(
	username			VARCHAR(25)		primary key,
	password			VARCHAR(25)		NOT NULL,
	AID					INT				NOT NULL	IDENTITY(1,1), -- (*)
	AType				INT				NOT NULL
)

CREATE TABLE Employer
(
	EID					INT				primary key	,	-- (0), link to (*)_
	EName				NVARCHAR(MAX)	NOT NULL,
	EEmail				VARCHAR(MAX)	NOT NULL,
	EAddress			NVARCHAR(MAX)	NOT NULL,
	EType				INT				NOT NULL		DEFAULT 0,		-- Link to (1)
)

CREATE TABLE Business_type
(
	EC_ID				INT				primary key IDENTITY(1,1),	-- (1)
	EC_Name				NVARCHAR(MAX)	NOT NULL,
	EC_FOfActivity		NVARCHAR(MAX)	NOT NULL,
)

CREATE TABLE Recruitment_Job
(		
	J_EID				INT				NOT NULL,		--  Link to (0)
	JID					INT				primary key IDENTITY(1,1),	-- (2)
	JName				NVARCHAR(MAX)	NOT NULL,
	JAddress			NVARCHAR(MAX)	NOT NULL,
	JInsurance			NVARCHAR(MAX)	NOT NULL,
	JTimeStart			DATE			NOT NULL,
	JTimeEnd_Expected	DATE			NOT NULL,
	JSalary				INT				NOT NULL,
	JDOff				INT				NOT NULL,
	JDescription		NVARCHAR(MAX)	NOT NULL
)

CREATE TABLE Candidate
(
	CID					INT				primary key,	-- (3), link to _(*)
	CFName				NVARCHAR(MAX)	NOT NULL,
	CAddress			NVARCHAR(MAX)	NOT NULL,
	CContact			CHAR(11)		NOT NULL,
	CEmail				VARCHAR(MAX)	NOT NULL,
	CDOB				DATE			NOT NULL,
	CID_Secure			INT				NOT NULL,
	CSex				BIT				NOT NULL,
	CSpecialize_Des		NVARCHAR(MAX)	NOT NULL,
)

CREATE TABLE Curriculum_Vitae
(
	CVC_RJID			INT					NOT NULL,		-- Link to (2)
	CV_CID				INT			NOT NULL,		-- Link to (3) *
	CVC_ThisID			INT					primary key IDENTITY(1,1),
	CVC_Education		NVARCHAR(MAX)	NOT NULL,
	CVC_Academic		NVARCHAR(MAX)	NOT NULL,
	CVC_ForeignL		NVARCHAR(MAX)	NOT NULL,
	CVC_Experience		NVARCHAR(MAX)	NOT NULL,
	CVC_Health			NVARCHAR(MAX)	NOT NULL,
	CVC_E_Communication	INT				NOT NULL,
	CVC_Cooperation		INT				NOT NULL,
	CVC_Presentation	INT				NOT NULL,
	CVC_Salary			DECIMAL(10,2)	NOT NULL,
)

CREATE TABLE Blog
(	
	B_AuthorID			INT					NOT NULL DEFAULT 'default',		-- Link to (3) **
	B_AuthorName		NVARCHAR(MAX)		NOT NULL,
	BID					INT					primary key IDENTITY(1,1),
	BName				NVARCHAR(MAX)		NOT NULL,		
	Content				NVARCHAR(MAX)		NOT NULL
)

-- ADD FOREIGN KEY FOR ALL TABLE.

--ALTER TABLE Employer ADD CONSTRAINT fk_Employer_ID_Unique FOREIGN KEY (EID) REFERENCES Account ( AID) ON DELETE CASCADE							-- (*)_ DONE.
--ALTER TABLE Candidate ADD CONSTRAINT fk_Candidate_ID_Unique FOREIGN KEY (CID) REFERENCES Account ( AID) ON DELETE CASCADE						-- _(*) DONE.

-- Employer Foreign to BusinessType, REMOVE BusinessType => SET DEFAULT Employer_classify
ALTER TABLE Employer ADD CONSTRAINT fk_Employer_classify FOREIGN KEY (EType) REFERENCES Business_type ( EC_ID) ON DELETE SET DEFAULT			-- (1) DONE.

-- RecruitmentJob Foreign to Employer, REMOVE Employer => Remove RecruitmentJob
ALTER TABLE Recruitment_Job ADD CONSTRAINT fk_Job_Employer_ID FOREIGN KEY (J_EID) REFERENCES Employer (EID)	ON DELETE CASCADE					-- (0) DONE.

-- CV Foreign to Candidate and Employer, REMOVE (Candidate or Employer) => REMOVE CV
ALTER TABLE Curriculum_Vitae ADD CONSTRAINT fk_CVC_Recruitment_Job_ID FOREIGN KEY (CVC_RJID) REFERENCES Recruitment_Job (JID) ON DELETE CASCADE	-- (2) DONE.
ALTER TABLE Curriculum_Vitae ADD CONSTRAINT fk_CV_Candidate_ID FOREIGN KEY (CV_CID) REFERENCES Candidate (CID)	ON DELETE CASCADE				-- (3)* DONE.

-- Blog Foreign to Candidate, REMOVE Candidate => SET DEFAULT Blog Author
ALTER TABLE Blog ADD CONSTRAINT fk_Blog_Author_ID FOREIGN KEY (B_AuthorID) REFERENCES Candidate (CID) ON DELETE SET DEFAULT						-- (3)** DONE.

--Create INDEX for table
CREATE INDEX indexAccount ON dbo.Account(username)
CREATE INDEX indexBlog ON dbo.Blog(BID)
CREATE INDEX indexBusiness_type ON dbo.Business_type(EC_ID)
CREATE INDEX indexCandidate ON dbo.Candidate(CID)
CREATE INDEX indexCurriculum_Vitae ON dbo.Curriculum_Vitae(CVC_ThisID)
CREATE INDEX indexEmployer ON dbo.Employer(EID)
CREATE INDEX indexRecruitment_Job ON dbo.Recruitment_Job(JID)

INSERT INTO dbo.Account VALUES('admin@stb.com','admin',-1)
INSERT INTO dbo.Business_type VALUES('default','default')