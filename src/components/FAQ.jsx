import { Collapse, Empty, Spin } from "antd";
import { useGetfaqQuery } from "../services/faqApi";
const { Panel } = Collapse;

const FAQ = () => {
  const { data, isLoading } = useGetfaqQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <Empty description="No FAQs available yet" />
      </div>
    );
  }

  return (
    <>
      <h3 className="mb-4 font-semibold text-lg">FAQs</h3>
      <Collapse accordion>
        {data.data.map((faq) => (
          <Panel header={faq.category} key={faq.id}>
            <Collapse ghost>
              <Panel header={faq.question} key={`q-${faq.id}`}>
                <p>{faq.answer}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Added by:{" "}
                  <span className="font-medium">{faq.user?.name ?? "N/A"}</span>
                </div>
              </Panel>
            </Collapse>
          </Panel>
        ))}
      </Collapse>
    </>
  );
};

export default FAQ;
