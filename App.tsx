
import { AuthNavigation } from "./src/navigation/main_navigation.tsx";
import { useCallback, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { database } from "./src/services/database/database.ts";

function App() {
  return (
    <NavigationContainer>
      <DatabaseProvider database={database}>
        <AuthNavigation />
      </DatabaseProvider>
    </NavigationContainer>
  );
}

export default App;
