import supabase from "../supabase";
import Calendar from "../components/Calendar";

const Page = () => {
  console.log(supabase)
  return (
    <>
      <Calendar />
    </>
  )
}

export default Page