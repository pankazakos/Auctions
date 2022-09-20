import { BrowserRouter} from "react-router-dom";
import { AuthProvider } from "./components/auth/Auth";
import { Views } from "./Views";




function App() {
    return (
        <div style={{height: "100%"}}>
            <BrowserRouter>
                <AuthProvider>
                    <Views />
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
