import React, {useState} from "react";
import Header from "../components/Header";
import ContentContainer from "../containers/ContentContainer";
export default function Home(){
    const [currentSection, setCurrentSection] = useState("home");
    return(
        <>
            <Header setCurrentSection={setCurrentSection}/>
            <ContentContainer currentSection={currentSection}/>
        </>
    )
}
