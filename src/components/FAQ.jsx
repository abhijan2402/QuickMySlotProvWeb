import { Collapse } from "antd";
const { Panel } = Collapse;
const FAQ = () => {
  const faqData = [
    {
      type: "Account",
      questions: [
        {
          q: "How to create an account?",
          a: "Click add account and fill details.",
        },
        { q: "How to edit account?", a: "Use edit button next to account." },
      ],
    },
    {
      type: "Wallet",
      questions: [
        { q: "How to add funds?", a: "Use Add Amount button in Wallet tab." },
        { q: "How to view history?", a: "Check Wallet History section." },
      ],
    },
  ];

  return (
    <>
      <h3 className="mb-4 font-semibold text-lg">FAQs</h3>
      {faqData.map((section, idx) => (
        <Collapse key={idx} defaultActiveKey={["1"]}>
          <Panel header={section.type} key="1">
            {section.questions.map((item, idx) => (
              <Collapse key={idx} ghost>
                <Panel header={item.q} key={idx}>
                  <p>{item.a}</p>
                </Panel>
              </Collapse>
            ))}
          </Panel>
        </Collapse>
      ))}
    </>
  );
};
export default FAQ; 