-- ########## Create DB ##########
create database SOLIENLACDIENTU;

-- ########## Create tables ##########
use SOLIENLACDIENTU;

create table if not exists SpecialistAssignment(
	specialistAssignmentId int auto_increment primary key,
    schoolYearId int not null,
    teacherId int not null,
    specialistTeamId int not null
);

create table if not exists HomeroomTeacherAssignment(
	homeroomTeacherAssignmentId int auto_increment primary key,
    teacherId int not null,
    classId int not null,
    schoolYearId int not null
);

create table if not exists TeachingAssignment(
	teachingAssignmentId int auto_increment primary key,
    teacherId int not null,
    classId int not null,
    subjectId int not null,
    schoolYearId int not null
);

create table if not exists StudentAssignment(
	studentAssignmentId int auto_increment primary key,
    studentId int not null,
    classId int not null,
    schoolYearId int not null
);

create table if not exists SpecialistTeam (
	specialistTeamId int auto_increment primary key,
    specialistName varchar(30) character set utf8 not null,
    description varchar(50) character set utf8 not null
);

create table if not exists Teacher (
	teacherId int auto_increment primary key,
    teacherCode varchar(10) character set utf8 not null,
    teacherName varchar(30) character set utf8 not null,
    dateOfBirth date default null,
    gender tinyint(1) default null,
    pId varchar(12) default null,
    image varchar(250) default null,
    address varchar(250) character set utf8 default null,
    permanentResidence varchar(250) character set utf8 default null,
    email varchar(30) not null,
    phoneNumber char(10) default null,
    dateOfParty date default null,
    dateOfUnion date default null,
    civilServantNumber char(10) default null,
    major varchar(30) character set utf8 default null
);

create table if not exists Student (
	studentId int auto_increment primary key,
    studentCode varchar(10) character set utf8 not null,
    studentName varchar(30) character set utf8 not null,
    address varchar(250) character set utf8 default null,
    permanentResidence varchar(250) character set utf8 default null,
    gender tinyint(1) default null,
    pId varchar(12) default null,
    image varchar(250) default null,
    dateOfBirth date default null,
    email varchar(30) not null,
    phoneNumber char(10) default null,
    dateOfParty date default null,
    dateOfUnion date default null,
    fatherName varchar(30) character set utf8 default null,
    fatherPhone char(10) default null,
    fatherMail varchar(30) default null,
    motherName varchar(30) character set utf8 default null,
    motherPhone char(10) default null,
    motherMail varchar(30) default null
);

create table if not exists Class (
	classId int auto_increment primary key,
    className varchar(30) character set utf8 not null,
    classCode varchar(10) not null,
    description varchar(50) character set utf8 not null
);

create table if not exists `Subject`(
	subjectId int auto_increment primary key,
    subjectCode varchar(10) not null,
    subjectName varchar(30) character set utf8 not null,
    description varchar(50) character set utf8 not null
);

create table if not exists Score(
	scoreId int auto_increment primary key,
    studentId int not null,
    teacherId int not null,
	subjectId int not null,
    schoolYearId int not null,
    kind tinyint(4) not null,
    score float not null,
    term tinyint(4) not null
);

create table if not exists ScoreLock(
	lock_Id int auto_increment primary key,
    schoolYearId int not null,
    `lock` tinyint(1) not null,
    term tinyint not null
);

create table if not exists Conduct(
	conductId int auto_increment primary key,
    studentId int not null,
    classId int not null,
    teacherId int not null,
    schoolYearId int not null,
    conduct tinyint not null,
    term tinyint not null,
    note varchar(1000) character set utf8 default null
);

create table if not exists Attendance(
	attendanceId int auto_increment primary key,
    studentId int not null,
    classId int not null,
    teacherId int not null,
    schoolYearId int not null,
    `date` date not null,
    attendance tinyint(1) not null,
    term tinyint not null
);

create table if not exists SchoolYear (
	schoolYearId int auto_increment primary key,
    schoolYear varchar(15) not null,
    beginSemester1 date not null,
    endSemester1 date not null,
    beginSemester2 date not null,
    endSemester2 date not null,
    description varchar(50) character set utf8 not null
);

create table if not exists Accounts (
	accountId int auto_increment primary key,
    role tinyint not null,
    accountName varchar(30) not null,
    `password` varchar(250) default null,
    userCode varchar(10) not null
);

-- ########## Add foreign key constraint ##########
alter table SpecialistAssignment
add constraint FK_SPA_specialistTeam foreign key (specialistTeamId) references SpecialistTeam(specialistTeamId),
add constraint FK_SPA_teacher foreign key (teacherId) references Teacher(teacherId),
add constraint FK_SPA_schoolYear foreign key (schoolYearId) references SchoolYear(schoolYearId);

alter table HomeroomTeacherAssignment
add constraint FK_HTA_teacher foreign key (teacherId) references Teacher(teacherId),
add constraint FK_HTA_class foreign key (classId) references Class(classId),
add constraint FK_HTA_schoolYear foreign key (schoolYearId) references SchoolYear(schoolYearId);

alter table TeachingAssignment
add constraint FK_TA_teacher foreign key (teacherId) references Teacher(teacherId),
add constraint FK_TA_class foreign key (classId) references Class(classId),
add constraint FK_TA_subject foreign key (subjectId) references `Subject`(subjectId),
add constraint FK_TA_schoolYear foreign key (schoolYearId) references SchoolYear(schoolYearId);

alter table StudentAssignment
add constraint FK_SA_student foreign key (studentId) references Student(studentId),
add constraint FK_SA_class foreign key (classId) references Class(classId),
add constraint FK_SA_schoolYear foreign key (schoolYearId) references SchoolYear(schoolYearId);

alter table Conduct
add constraint FK_CD_student foreign key (studentId) references Student(studentId),
add constraint FK_CD_class foreign key (classId) references Class(classId),
add constraint FK_CD_teacher foreign key (teacherId) references Teacher(teacherId),
add constraint FK_CD_schoolYear foreign key (schoolYearId) references SchoolYear(schoolYearId);

alter table Attendance
add constraint FK_AD_student foreign key (studentId) references Student(studentId),
add constraint FK_AD_class foreign key (classId) references Class(classId),
add constraint FK_AD_teacher foreign key (teacherId) references Teacher(teacherId),
add constraint FK_AD_schoolYear foreign key (schoolYearId) references SchoolYear(schoolYearId);

alter table Score
add constraint FK_SC_student foreign key (studentId) references Student(studentId),
add constraint FK_SC_subject foreign key (subjectId) references `Subject`(subjectId),
add constraint FK_SC_teacher foreign key (teacherId) references Teacher(teacherId),
add constraint FK_SC_schoolYear foreign key (schoolYearId) references SchoolYear(schoolYearId);

alter table ScoreLock
add constraint FK_SCL_schoolYear foreign key (schoolYearId) references SchoolYear(schoolYearId);

-- ########## Some field must be UNIQUE ##########
alter table HomeroomTeacherAssignment
add unique `teacher_scyear` (`schoolYearId`,`teacherId`),
add unique `class_scyear` (`schoolYearId`,`classId`);

alter table TeachingAssignment
add unique `teacherId` (`teacherId`,`classId`,`subjectId`,`schoolYearId`);

alter table StudentAssignment
add unique `student_scyear` (`studentId`,`schoolYearId`);

alter table Accounts
add constraint UC_ACC_name unique(accountName),
add constraint UC_ACC_code unique(userCode);

alter table Student
add constraint UC_STD_email unique(email),
add constraint UC_STD_code unique(studentCode);

alter table Teacher
add constraint UC_TCH_email unique(email),
add constraint UC_TCH_code unique(teacherCode);
