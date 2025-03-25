-- we'll do smth like this where each course has a course id
-- and then lab/quiz/assignment can reference course id
create table course ( 
    course_id text not null,
    term_offered integer check (term_offered in (1,2,3)) not null,
    course_name text not null,
    primary key(course_id)
);

create table lab (
    course_id text not null,
    lab_date date not null,
    foreign key(course_id) references course(course_id)
);

create table quiz (
    course_id text not null,
    quiz_date date not null,
    foreign key(course_id) references course(course_id)
);

create table assignment (
    course_id text not null,
    assignment_date date not null,
    foreign key(course_id) references course(course_id)
);