import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/LoginPage/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Add_Sender_Company from "./Components/SenderCompany/Add_Sender_Company";
import Add_Client from "./Components/Clients/AddClient";
import { Navbar } from "./Components/Navbar/Navbar";
import { Clients } from "./Components/Clients/Clients";
import { Footer } from "./Components/Footer/Footer";
import { Invoice } from "./Components/Invoice/Invoice";
import { CreateInvoice } from "./Components/Invoice/CreateInvoice";
import {ViewInvoice} from "./Components/Invoice/ViewInvoice"
import "./App.css";
import CreateCourse from "./Components/Course/CreateCourse";
import { Course } from "./Components/Course/Course";
import CreateStudent from "./Components/Students/CreateStudent";
import { Student } from "./Components/Students/Student";
function App() {
  const authToken = localStorage.getItem("token");
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        closeOnClick
        rtl={false}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/add_sender" element={<Add_Sender_Company />} />
          {/* <Route path="/add_client" element={<Add_Client />} /> */}
          <Route path="/create_course" element={<CreateCourse />} />
          <Route path="/update_course/:id" element={<CreateCourse />} />
          <Route path="/update_client/:id" element={<Add_Client />} />
          {/* <Route path="/clients" element={<Clients />} /> */}
          <Route path="/create_student" element={<CreateStudent />} />
          <Route path="/update_student/:id" element={<CreateStudent />} />

          <Route path="/student" element={<Student />} />
          <Route path="/course" element={<Course />} />
          <Route path="/invoices" element={<Invoice />} />
          <Route path="/viewInvoice" element={<ViewInvoice/>}/>
          <Route path="/createInvoice" element={<CreateInvoice />} />
          <Route path="/updateInvoice/:invoiceId" element={<CreateInvoice />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
