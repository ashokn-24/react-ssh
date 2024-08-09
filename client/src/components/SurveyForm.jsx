/* eslint-disable no-unused-vars */
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "../index.css";
import jsonForm from "../ScholarshipJASON.json";

function SurveyForm() {
  const survey = new Model(jsonForm);
  survey.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));
  });
  return <Survey model={survey} />;
}

export default SurveyForm;
