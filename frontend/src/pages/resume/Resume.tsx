import { ReactNode, useState } from "react";
import { Columns2, Rows2 } from "lucide-react";
import IconButton, { IconSize } from "../../components/IconButton";

export default function Resume() {
    // const [stacked, setStacked] = useState(false);
    const stacked = true;

    function SubHeading({ children }: { children: ReactNode }) {
        return <h3 className="text-highlight font-semibold text-lg">{children}</h3>
    }

    function Td({ children, header = false, className = "", fit = false, fill = false }: { children: ReactNode, header?: boolean, className?: string, fit?: boolean, fill?: boolean }) {
        return <td className={`align-top ${fit ? "w-[1%] whitespace-nowrap" : ""} ${fill ? "w-full" : ""} ${header ? "font-bold text-right" : ""} ${className}`}>{children}</td>
    }

    function Section({ title, children }: { title?: string, children: ReactNode}) {
        return <div className="w-full flex flex-col items-start gap-4">
            {title && <SubHeading>{title}</SubHeading>}
            {children}
        </div>
    }

    function Table({ children, className = "" }: { children: ReactNode, className?: string }) {
        return <table className={`[&_td:not(:last-child)]:pr-4 [&_tr:not(:last-child)_td]:pb-4 ${className}`}>
            <tbody>{children}</tbody>
        </table>
    }

    function P({ children }: {children: ReactNode }) {
        return <p className="w-full text-justify">{children}</p>
    }

    function ExperienceSection({ title, date, children }: { title: string, date: string, children: ReactNode}) {
        return <>
            <Table>
                <tr>
                    <Td fill className="font-bold">{title}</Td>
                    <Td fit>{date}</Td>
                </tr>
            </Table>

            <P>{children}</P>
        </>
    }

    function Page({ children }: { children: ReactNode}) {
        return <div className="w-[210mm] h-[297mm] p-[1in] bg-bg">
            <div className="flex flex-col gap-8 bg-bg h-full overflow-hidden">
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
                        <tr><Td header>Email</Td><Td>jasperpato@gmail.com</Td><Td header>GitHub</Td><Td>github.com/jasperpato</Td></tr>
                        <tr><Td header>Website</Td><Td>jasperpato.com</Td><Td header>LinkedIn</Td><Td>linkedin.com/in/jasper-paterson-798b1317b</Td></tr>
                    </Table>
                </Section>

                <Section title="Education">
                    <Table className="w-full">
                        <tr>
                            <Td header fit>Secondary</Td>
                            <Td fill>Newman College Churchlands</Td>
                            <Td fit>ATAR</Td>
                            <Td fit>98.9</Td>
                            <Td fit className="pl-4">2013 - 2018</Td>
                        </tr>
                        <tr>
                            <Td header fit>Undergrad</Td>
                            <Td fill>UWA Bachelor of Science in Engineering and Computer Science</Td>
                            <Td fit>WAM<br/>GPA</Td>
                            <Td fit>86.0<br/>6.9</Td>
                            <Td fit className="pl-4">2019 - 2021</Td>
                        </tr>
                        <tr>
                            <Td header fit>Postgrad</Td>
                            <Td fill>UWA Master of Professional Engineering (Software)</Td>
                            <Td fit>WAM<br/>GPA</Td>
                            <Td fit>85.9<br/>7.0</Td>
                            <Td fit className="pl-4">2022 - 2024</Td>
                        </tr>
                    </Table>
                </Section>

                <Section title="Experience">
                    <ExperienceSection
                        title="Aurora Offshore Engineering"
                        date="January 2025 - Present"
                    >
                        CEED here. After completing my Master of Engineering, I have continued working at AOE
                        as a full-time software engineer, in charge of their software systems and
                        development. I set up a collaborative, version-controlled software
                        environment for the engineering team using GitHub and worked on
                        transitioning AOE’s engineering tools from Excel workbooks into flexible,
                        reusable and computationally efficient Python programs using Pandas,
                        NumPy and SciPy. I also created an internal web application using React.js,
                        Django, Celery and Docker for the engineers to be able to access shared
                        engineering tools and data. I then converted the app into a free web
                        application deployed on Microsoft Azure at https://auroracat.app. I am now
                        working on a desktop version of the app using Multiplatform Compose. 
                    </ExperienceSection>
                </Section>
            </Page>

            <Page>
                <Section>
                    <ExperienceSection
                        title="ICRAR Studentship"
                        date="Nov 2023 - Feb 2024"
                    >
                        Over the summer of 2023/24 I completed a paid studentship with the
                        International Centre for Radio Astronomy Research (ICRAR) at the Curtin
                        Institute of Radio Astronomy. I was lucky to join the Commensal Real-time
                        ASKAP Fast Transients (CRAFT) Survey team researching fast radio bursts
                        (FRBs) originating from distant galaxies. My tasks included researching
                        leading theories on the progenitors of FRBs, data processing and statistical
                        analysis of FRB burst profiles using Python and presenting findings to the
                        ICRAR community at the student seminar.
                    </ExperienceSection>

                    <ExperienceSection
                        title="Coders for Causes"
                        date="Jun 2023 - Jul 2023"
                    >
                        During the winter break of 2023 I volunteered for the Coders for Causes
                        winter project. I worked on the frontend and backend in a team of fifteen
                        computer science students to create a web application for a charity
                        organisation using Vue.js, Django, PostgreSQL, Git, Figma and Docker. 
                    </ExperienceSection>

                    <ExperienceSection
                        title="UWA Lab Demonstrator"
                        date="Feb 2022 - Oct 2024"
                    >
                        I worked at the University of Western Australia (UWA) for three years as
                        a lab facilitator for Computational Thinking in Python, Graphics and
                        Animation (C++ and OpenGL), Systems Programming (Unix and C), Computer
                        Networks (Python and C) and Secure Coding (Python and C). I helped
                        students with lab work and projects, taught computer science concepts,
                        created marking keys and automated testing scripts for projects, and
                        graded final exams.
                    </ExperienceSection>
                </Section>

                <Section title="About Me">
                    <P>
                        I love playing and watching tennis and have captained four pennant-winning teams
                        at UWA Tennis Club over the last six years. I captained two WA State League
                        teams in the 2019/20 and 2020/21 seasons. I also love playing beach volleyball,
                        netball and basketball.

                        I have a short story published in Westerly Magazine issue 66.2 that I wrote as
                        part of a creative writing elective at UWA.
                    </P>
                </Section>
            </Page>

            <Page>
                <Section title="Awards">
                    <P>
                        I accepted the five-year UWA Engineering Scholarship after graduating high school
                        in 2018.
                        <br/>
                        While at UWA I achieved the highest mark in two units, Mobile and Wireless
                        Computing and Software Testing and Quality Assurance, and received three letters
                        of commendation for excellence in teaching.
                    </P>
                </Section>

                <Section title="Technologies">
                    <P>
                        <ul>
                            <li>Web development with React.js, Vue.js, Next.js, Django, Prisma, PlanetScale and Docker</li>
                            <li>Machine learning, evolutionary algorithms and computer vision using Tensorflow and OpenCV</li>
                            <li>Parallel processing and code optimisation with C, OpenMP, OpenMPI and NumPy</li>
                            <li>Cloud computing with AWS and Azure</li>
                            <li>Embedded systems and robotics with Arduino, Pioneer 3-AT and ROS2</li>
                            <li>Graphics and animation with C++ and OpenGL</li>
                            <li>Application development with Kotlin and Multiplatform Compose</li>
                        </ul>
                    </P>
                </Section>
            </Page>
        </div>
    </>
}