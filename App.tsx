
import { AuthNavigation } from "./src/navigation/main_navigation.tsx";
import { useCallback, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";


function App() {
  return (
    <NavigationContainer>
        <AuthNavigation />
    </NavigationContainer>
  );
}

export default App;
