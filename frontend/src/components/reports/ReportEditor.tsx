import { useCallback, useEffect, useState } from "react";
import { FullReport } from "../../models";
import api from "../../api";
import Loading from "../Loading";
import { Link, Navigate, useParams } from "react-router-dom";
import { FormContainer, FormInput, FormLabel, Error, SubHeading, Link as BaseLink, FormButton, FormCancelButton } from "../base/Base";
import MarkdownEditor from "../base/MarkdownEditor";

export default function ReportEditor() {
  const [currentReport, setCurrentReport] = useState<FullReport | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [reportId, setReportId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const [headerImage, setHeaderImage] = useState<string>('');
  const [content, setContent] = useState<string>('');

  // use params to check if we are at reports/x/edit or reports/new
  // If editing, reset the state first with the correct valeus
  const { reportId: reportIdParam } = useParams();

  useEffect(() => {
    if (reportIdParam) {
      api.get(`reports/${reportIdParam}/`).then(res => {
        let report = (res.data as FullReport);
        setReportId(report.id)
        setCurrentReport(report)

        setTitle(report.title);
        setHeaderImage(report.header_image);
        setContent(report.content);
      })
    }
    setLoading(false);
  }, [reportIdParam])

  const updateReport = useCallback(e => {
    e.preventDefault();
    let newReport = Object.assign({}, currentReport);

    newReport.title = title;
    newReport.header_image = headerImage;
    newReport.content = content;

    if (reportId) {
      setErrorText(null);
      api.put(`reports/${reportId}/`, newReport).then(res => {
        setSubmitted(true);
      })
    } else {
      setErrorText(null);
      api.post(`reports/`, newReport).then(res => {
        setReportId((res.data as FullReport).id);
        setSubmitted(true);
      })
    }
  }, [title, content, headerImage, currentReport, reportId])
  
  if (submitted) {
    return <Navigate to={`../${reportId}`} />
  }

  return (
    <Loading loading={loading}>
      <FormContainer>
        <SubHeading>Edit Report</SubHeading>
        <form onSubmit={updateReport}>
          <div className="w-full">
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormInput 
              type="string" id="title" 
              value={title} onChange={event => setTitle(event.target.value)} />
          </div>
          <div className="w-full">
            <FormLabel htmlFor="himage">Header Image URL (copy image link from somewhere else on site)</FormLabel>
            <FormInput 
              type="string" id="himage" 
              value={headerImage} onChange={event => setHeaderImage(event.target.value)} />
          </div>
          <FormLabel htmlFor="description">Description (uses <BaseLink href="https://www.markdownguide.org/basic-syntax/">markdown</BaseLink>)</FormLabel>
          <MarkdownEditor id="description" 
            value={content} setValue={setContent}
          />

          {errorText && <Error>{errorText}</Error>}
          <div className="flex justify-between">
            <FormButton
              type="submit">
                Submit
            </FormButton>
            <Link to={`../${reportId ? reportId : '' }`}>
              <FormCancelButton className="ml-auto">Cancel</FormCancelButton>
            </Link>
          </div>
        </form>
      </FormContainer>

    </Loading>

  )
}