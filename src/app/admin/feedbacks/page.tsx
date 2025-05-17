import { getCustomerFeedbacks } from "@/actions/feedbacks";
import PageComponent from "@/app/admin/feedbacks/page-component";

const FeedbackPage = async () => {
  const customerFeedbacks = await getCustomerFeedbacks();

  if (!customerFeedbacks || customerFeedbacks.length === 0)
    return (
      <div className="text-center font-bold text-2xl">No Feedbacks Found</div>
    );

  return <PageComponent customerFeedbacks={customerFeedbacks} />;
};

export default FeedbackPage;
