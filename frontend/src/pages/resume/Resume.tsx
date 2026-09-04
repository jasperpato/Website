import { ReactNode } from "react";

export default function Resume() {
    
    function SubHeading({ children }: { children: ReactNode }) {
        return <h3 className="text-highlight font-semibold pb-4">{children}</h3>
    }

    function Td({ children, header = false }: { children: ReactNode, header?: boolean }) {
        return <td className={`pr-4 ${header ? "font-bold text-right" : ""}`}>{children}</td>
    }
    
    return <>
        <div className="m-8 flex-col gap-8">
            <h2>Jasper Paterson - Software Engineer</h2>

            <SubHeading>Personal Details</SubHeading>
            
            <table>
                <tbody>
                    <tr><Td header>Email</Td><Td>jasperpato@gmail.com</Td><Td header>Github</Td><Td>github.com/jasperpato</Td></tr>
                    <tr><Td header>Phone</Td><Td>0481092517</Td><Td header>Website</Td><Td>jasperpato.com</Td></tr>
                </tbody>
            </table>

            <SubHeading>Education</SubHeading>
            
            <table>
                <tbody>
                    <tr><Td header>Secondary</Td><Td>Newman College Churchlands</Td><Td>2013-2018</Td></tr>
                    <tr><Td header>Undergrad</Td><Td>UWA Bachelor of Science in Engineering and Computer Science</Td><Td>2019-2021</Td></tr>
                    <tr><Td header>Postgrad</Td><Td>UWA Master of Professional Engineering (Software)</Td><Td>2022-2024</Td></tr>
                </tbody>
            </table>
        </div>
    </>
}