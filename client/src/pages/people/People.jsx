import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Title from "@components/title/Title.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Toast from "@components/toast/Toast.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import style from "./People.module.css";

function People() {
  const { courseId } = useParams();
  const toast = useRef();

  const {
    data: students,
    done: doneStudents,
    isError: isErrorStudents,
    fetchData: fetchStudents,
  } = useFetch(`/api/course/${courseId}/student`);

  const {
    data: instructors,
    done: doneInstructors,
    isError: isErrorInstructors,
    fetchData: fetchInstructors,
  } = useFetch(`/api/course/${courseId}/instructor`);

  const type = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchInstructors();
  }, []);

  useEffect(() => {
    if (isErrorInstructors || isErrorStudents) {
      toast.current.show("Error loading people");
    }
  }, [isErrorInstructors, isErrorStudents]);

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <div className={style.controls}>
          <Title title="People" />
          {type === "instructor" && (
            <button
              className={style.addstudent}
              onClick={() => {
                navigate(`/course/${courseId}/newstudent`);
              }}
            >
              Add Student
            </button>
          )}
        </div>
        {doneInstructors && doneStudents ? (
          <div className={style.people}>
            {instructors.map((instructor) => (
              <div className={style.instructor} key={instructor._id}>
                <p>{instructor.name}</p>
                <p>Instructor</p>
              </div>
            ))}
            {students.map((student) => (
              <div className={style.student} key={student._id}>
                <p>{student.name}</p>
                <p>Student</p>
              </div>
            ))}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default People;