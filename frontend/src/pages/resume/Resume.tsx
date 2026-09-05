import { ReactNode, useState } from "react";
import { Columns2, Rows2 } from "lucide-react";
import IconButton, { IconSize } from "../../components/IconButton";

export default function Resume() {
    // const [stacked, setStacked] = useState(false);
    const stacked = true;

    function SubHeading({ children, className = "" }: { children: ReactNode, className?: string }) {
        return <h3 className={`text-highlight font-semibold text-lg ${className}`}>{children}</h3>
    }

    function Td({ children = "", header = false, className = "", fit = false, fill = false, right = false }: { right?: boolean, children?: ReactNode, header?: boolean, className?: string, fit?: boolean, fill?: boolean }) {
        return <td className={`align-top ${fit ? "w-[1%] whitespace-nowrap" : ""} ${fill ? "w-full" : ""} ${right ? "text-right" : ""} ${header ? "font-bold text-right" : ""} ${className}`}>{children}</td>
    }

    function Section({ title, children }: { title?: string, children: ReactNode}) {
        return <>
            <div className="w-full flex flex-col items-start gap-2">
                {title && <SubHeading>{title}</SubHeading>}

                <div className="flex flex-col gap-8">
                    {children}
                </div>
            </div>
        </>
    }

    function Table({ children, className = "" }: { children: ReactNode, className?: string }) {
        return <table className={`[&_td:not(:last-child)]:pr-4 [&_tr:not(:last-child)_td]:pb-2 ${className}`}>
            <tbody>{children}</tbody>
        </table>
    }

    function P({ children }: {children: ReactNode }) {
        return <p className="w-full text-justify">{children}</p>
    }

    function ExperienceSection({ title, date, children = "", color, colors }: { color?: string, colors?: string[], title: string, date: string, children?: ReactNode}) {
        return <>
            <div className="flex flex-col gap-4">
                <Table>
                    <tr>
                        <Td fill className="font-bold">
                            <div className="flex items-center gap-2">
                                {colors ? (
                                    <div
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ background: `linear-gradient(to right, ${colors[0]} 50%, ${colors[1]} 50%)` }}
                                    />
                                ) : color && (
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                )}
                                <span>{title}</span>
                            </div>
                        </Td>
                        <Td fit>{date}</Td>
                    </tr>
                </Table>
                            
                {children}
            </div>
        </>
    }

    function Page({ children }: { children: ReactNode}) {
        return <div className="w-[210mm] h-[297mm] p-[0.8in] bg-bg">
            <div className="flex flex-col gap-6 bg-bg h-full overflow-hidden">
                {children}
            </div>
        </div>
    }
    
    return <>
        <div className={`p-8 flex ${stacked ? "flex-col items-center" : "flex-row"} justify-center gap-8 bg-border relative`}>
            {/* <IconButton
                icon={stacked ? Columns2 : Rows2}
                color="var(--color-primary)"
                background="var(--color-bg)"
                size={IconSize.LARGE}
                onClick={() => setStacked(s => !s)}
                className="absolute top-4 left-4 z-10 bg-bg shadow"
            /> */}

            <Page>
                <h2>Jasper Paterson<span className="px-3">•</span>Full Stack Software Engineer</h2>
                
                <Section title="Personal Details">
                    <Table>
                        <tr>
                            <Td header>Email</Td><Td>jasperpato@gmail.com</Td>
                            <Td header>GitHub</Td><Td>github.com/jasperpato</Td>
                        </tr>
                        <tr>
                            <Td header>Website</Td><Td>jasperpato.com</Td>
                            {/* <Td header>LinkedIn</Td><Td>linkedin.com/in/jasper-paterson-798b1317b</Td> */}
                        </tr>
                    </Table>
                </Section>

                <Section title="Education">
                    <Table className="w-full">
                        {/* <tr>
                            <Td header fit>Secondary</Td>
                            <Td fill>Newman College Churchlands</Td>
                            <Td fit header>ATAR</Td>
                            <Td fit>98.9</Td>
                            <Td fit className="pl-4">2013 - 2018</Td>
                        </tr> */}
                        <tr>
                            <Td header fit>Undergrad</Td>
                            <Td fill>UWA Bachelor of Science in Engineering Science and Computer Science</Td>
                            {/* <Td fit header>WAM<br/>GPA</Td>
                            <Td fit>86.0<br/>6.9</Td> */}
                            <Td fit className="pl-4">2019 - 2021</Td>
                        </tr>
                        <tr>
                            <Td header fit>Postgrad</Td>
                            <Td fill>UWA Master of Professional Engineering (Software Specialisation)</Td>
                            {/* <Td fit header>WAM<br/>GPA</Td>
                            <Td fit>85.9<br/>7.0</Td> */}
                            <Td fit className="pl-4">2022 - 2024</Td>
                        </tr>
                    </Table>
                </Section>

                <Section title="Experience">
                    <ExperienceSection
                        // colors={["var(--color-aurora-blue)", "var(--color-aurora-light-blue)"]}
                        color="var(--color-aurora-blue)"
                        title="Aurora Offshore Engineering"
                        date="January 2025 - Present"
                    >
                        <P>
                            CEED here. efficient Python programs using Pandas,
                            NumPy and SciPy. I also created an internal web application using React.js,
                            Django, Celery and Docker for the engineers to be able to access shared
                            engineering tools and data. I then converted the app into a free web
                            application deployed on Microsoft Azure at https://auroracat.app. I am now
                            working on a desktop version of the app using Multiplatform Compose. 
                        </P>
                    </ExperienceSection>

                    <ExperienceSection
                        color="var(--color-icrar-red)"
                        title="ICRAR Studentship"
                        date="Nov 2023 - Feb 2024"
                    >
                        <P>
                            Over the summer of 2023/24 I completed a paid studentship with the
                            International Centre for Radio Astronomy Research (ICRAR) at the Curtin
                            Institute of Radio Astronomy. I was lucky to join the Commensal Real-time
                            ASKAP Fast Transients (CRAFT) Survey team researching fast radio bursts
                            (FRBs) originating from distant galaxies. My tasks included researching
                            leading theories on the progenitors of FRBs, data processing and statistical
                            analysis of FRB burst profiles using Python and presenting findings to the
                            ICRAR community at the student seminar.
                        </P>
                    </ExperienceSection>

                    <ExperienceSection
                        color="black"
                        title="Coders for Causes"
                        date="Jun 2023 - Jul 2023"
                    />

                    <ExperienceSection
                        color="var(--color-uwa-gold)"
                        title="UWA Lab Demonstrator"
                        date="Feb 2022 - Oct 2024"
                    >
                        <Table>
                            <tr><Td>Computational Thinking in Python</Td><Td>Graphics and Animation</Td></tr>
                            <tr><Td>Systems Programming</Td><Td>Computer Networks</Td></tr>
                            <tr><Td>Secure Coding</Td><Td></Td></tr>
                        </Table>
                    </ExperienceSection>
                </Section>
            </Page>
        </div>
    </>
}