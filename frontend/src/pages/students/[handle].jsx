import StudentProfile from "@/components/student/StudentProfile";

const StudentProfilePage = ({ handle }) => {
  return (
    <div className="p-6">
      <StudentProfile handle={handle} />
    </div>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      handle: context.params.handle,
    },
  };
}

export default StudentProfilePage;
