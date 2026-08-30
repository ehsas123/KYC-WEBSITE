/* ============================================================
   KYC STUDENT HELP DESK
============================================================ */


/* ───────────────────────────────────────────────────────────
   MOBILE MENU
─────────────────────────────────────────────────────────── */

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {

    hamburger.addEventListener("click", () => {

        mobileMenu.classList.toggle("show");

    });

}


/* ───────────────────────────────────────────────────────────
   GENERATE TICKET ID
─────────────────────────────────────────────────────────── */

function generateTicketId() {

    const counterKey = "kyc_student_ticket_counter";

    let counter =
        parseInt(
            localStorage.getItem(counterKey) || "0"
        ) + 1;

    localStorage.setItem(
        counterKey,
        counter
    );

    return "KYC-STU-" +
        String(counter).padStart(4, "0");
}


/* ───────────────────────────────────────────────────────────
   SAVE REQUEST
─────────────────────────────────────────────────────────── */

function getStudentRequests() {

    return JSON.parse(
        localStorage.getItem(
            "kyc_student_requests"
        ) || "[]"
    );

}


function saveStudentRequest(request) {

    const requests =
        getStudentRequests();

    requests.push(request);

    localStorage.setItem(
        "kyc_student_requests",
        JSON.stringify(requests)
    );

}


/* ───────────────────────────────────────────────────────────
   ASK KYC FORM
─────────────────────────────────────────────────────────── */

const studentForm =
    document.getElementById(
        "studentHelpForm"
    );

const studentSuccess =
    document.getElementById(
        "studentFormSuccess"
    );


if (studentForm) {

    studentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const ticketId =
                generateTicketId();


            const request = {

                ticketId: ticketId,

                name:
                    document.getElementById(
                        "studentName"
                    ).value.trim(),

                course:
                    document.getElementById(
                        "studentCourse"
                    ).value.trim(),

                college:
                    document.getElementById(
                        "studentCollege"
                    ).value.trim(),

                category:
                    document.getElementById(
                        "studentCategory"
                    ).value,

                question:
                    document.getElementById(
                        "studentQuestion"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "studentPhone"
                    ).value.trim(),

                contact:
                    document.getElementById(
                        "studentContact"
                    ).value,

                status: "Submitted",

                createdAt:
                    new Date().toISOString()

            };


            saveStudentRequest(request);


            studentSuccess.innerHTML = `
                <strong>Request submitted successfully.</strong><br>
                Your Ticket ID is
                <strong>${ticketId}</strong>.
                Please save this ID to track your request.
            `;

            studentSuccess.classList.add(
                "show"
            );


            studentForm.reset();


            studentSuccess.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }
    );

}


/* ───────────────────────────────────────────────────────────
   TRACK REQUEST
─────────────────────────────────────────────────────────── */

const trackForm =
    document.getElementById(
        "trackRequestForm"
    );

const trackResult =
    document.getElementById(
        "trackResult"
    );


if (trackForm) {

    trackForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const ticketId =
                document.getElementById(
                    "ticketInput"
                ).value
                .trim()
                .toUpperCase();


            const requests =
                getStudentRequests();


            const request =
                requests.find(
                    item =>
                        item.ticketId === ticketId
                );


            trackResult.classList.add(
                "show"
            );


            if (!request) {

                trackResult.innerHTML = `
                    <strong>Ticket not found.</strong>
                    <br>
                    <small>
                        Please check your Ticket ID
                        and try again.
                    </small>
                `;

                return;

            }


            trackResult.innerHTML = `

                <strong>
                    Ticket:
                    <span>${request.ticketId}</span>
                </strong>

                <br><br>

                <small>
                    Category:
                    ${request.category}
                </small>

                <br>

                <small>
                    Status:
                    <span>${request.status}</span>
                </small>

                <br>

                <small>
                    Submitted:
                    ${new Date(
                        request.createdAt
                    ).toLocaleDateString("en-IN")}
                </small>

            `;

        }
    );

}