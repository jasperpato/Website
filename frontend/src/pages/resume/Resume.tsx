import { ReactNode, useState } from "react";
import { Columns2, Rows2 } from "lucide-react";
import IconButton, { IconSize } from "../../components/IconButton";

export default function Resume() {
    // const [stacked, setStacked] = useState(false);
    const stacked = true;

    function SubHeading({ children, className = "" }: { children: ReactNode, className?: string }) {
        return <h3 className={`text-primary font-bold text-lg ${className}`}>{children}</h3>
    }

    function Td({ children = "", header = false, className = "", fit = false, fill = false, right = false }: { right?: boolean, children?: ReactNode, header?: boolean, className?: string, fit?: boolean, fill?: boolean }) {
        return <td className={`align-top ${fit ? "w-[1%] whitespace-nowrap" : ""} ${fill ? "w-full" : ""} ${right ? "text-right" : ""} ${header ? "font-bold text-right" : ""} ${className}`}>{children}</td>
    }

    function Section({ title, children }: { title?: string, children: ReactNode}) {
        return <>
            <div className="w-full flex flex-col items-start gap-2">
                {title && <SubHeading>{title}</SubHeading>}

                <div className="flex flex-col gap-6 w-full">
                    {children}
                </div>
            </div>
        </>
    }

    function Table({ children, className = "" }: { children: ReactNode, className?: string }) {
        return <table className={`[&_td:not(:last-child)]:pr-6 [&_tr:not(:last-child)_td]:pb-2 ${className}`}>
            <tbody>{children}</tbody>
        </table>
    }

    function P({ children }: {children: ReactNode }) {
        return <p className="w-full text-justify">{children}</p>
    }

    function ExperienceSection({ title, date, children = "", color, colors }: { color?: string, colors?: string[], title: string, date: string, children?: ReactNode}) {
        return <>
            <div className="flex flex-col gap-2">
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

    function A({ children, href }: { children: ReactNode, href: string }) {
        return <a target="_blank" rel="noopener noreferrer" href={href} className="text-none hover:text-secondary">
            {children}
        </a>
    }

    function Page({ children }: { children: ReactNode}) {
        return <div className="w-[210mm] h-[297mm] p-[0.8in] bg-bg">
            <div className="flex flex-col gap-6 bg-bg h-full overflow-hidden">
                {children}
            </div>
        </div>
    }

    function List({ children, color = "black" }: { children: ReactNode, color?: string }) {
        return <ul className="list-disc pl-4 marker:text-[var(--marker-color)]" style={{ "--marker-color": color } as React.CSSProperties}>{children}</ul>
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

                <Section title="About Me">
                    <P>
                        Tennis player, full stack engineer, love physics, short story
                    </P>
                </Section>
                
                <Section title="Personal Details">
                    <Table>
                        <tr>
                            <Td header>Email</Td><Td>jasperpato@gmail.com</Td>
                            <Td header>GitHub</Td><Td><A href="https://github.com/jasperpato/">github.com/jasperpato</A></Td>
                        </tr>
                        <tr>
                            <Td header>Website</Td><Td><A href="https://jasperpato.com/">jasperpato.com</A></Td>
                            <Td header>LinkedIn</Td><Td><A href="https://www.linkedin.com/in/jasper-paterson-798b1317b"><div>linkedin.com/in/jasper-paterson-798b1317b</div></A></Td>
                        </tr>
                    </Table>
                </Section>

                <Section title="Education">
                    <Table className="w-full">
                        <tr>
                            <Td header fit>Undergrad</Td>
                            <Td fill>UWA Bachelor of Science in Engineering Science and Computer Science</Td>
                            <Td fit right>WAM<br/>GPA</Td>
                            <Td fit>86.0<br/>6.91</Td>
                            <Td fit right>2019 - 2021</Td>
                        </tr>
                        <tr>
                            <Td header fit>Postgrad</Td>
                            <Td fill>UWA Master of Professional Engineering (Software Specialisation)</Td>
                            <Td fit right>WAM<br/>GPA</Td>
                            <Td fit>85.9<br/>7.00</Td>
                            <Td fit right>2022 - 2024</Td>
                        </tr>
                    </Table>
                </Section>

                <Section title="Experience">
                    <ExperienceSection
                        // colors={["var(--color-aurora-blue)", "var(--color-aurora-light-blue)"]}
                        // color="var(--color-aurora-blue)"
                        title="Aurora Offshore Engineering"
                        date="January 2025 - Present"
                    >
                        <List color="var(--color-uwa-blue)">
                            <li>CEED research project</li>
                            <li>efficient Python programs using Pandas, NumPy and SciPy.</li>
                            <li>I also created an internal web application using React.js,
                            Django, Celery and Docker deployed on Microsoft Azure at <A href="https://auroracat.app/">auroracat.app</A></li>
                            <li>desktop version of the app using Multiplatform Compose.</li>
                            <li>Azure Container Apps, PostgreSQL, Functions, DNS Zones, Front Door</li>
                        </List>
                    </ExperienceSection>

                    <ExperienceSection
                        // color="var(--color-icrar-red)"
                        title="ICRAR Studentship"
                        date="Nov 2023 - Feb 2024"
                    >
                        <List color="var(--color-icrar-red)">
                            <li>Joined the Commensal Real-time
                            ASKAP Fast Transients (CRAFT) Survey team researching Fast Radio Bursts
                            (FRBs)</li>
                            <li>Researched leading theories on the progenitors of FRBs</li>
                            <li>Data processing and statistical analysis of FRB burst profiles and host galaxy data</li>
                        </List>
                    </ExperienceSection>

                    <ExperienceSection
                        // color="black"
                        title="Coders for Causes"
                        date="Jun 2023 - Jul 2023"
                    />

                    <ExperienceSection
                        // color="var(--color-uwa-gold)"
                        title="UWA Lab Demonstrator"
                        date="Feb 2022 - Oct 2024"
                    >
                        <div className="flex flex-row gap-8">
                            <List color="var(--color-uwa-gold)">
                                <li>Computational Thinking in Python</li>
                                <li>Graphics and Animation</li>
                                <li>Systems Programming</li>
                            </List>
                    
                            <List color="var(--color-uwa-gold)">
                                <li>Computer Networks</li>
                                <li>Secure Coding</li>
                            </List>
                         </div>
                    </ExperienceSection>
                </Section>
            </Page>
        </div>
    </>
}