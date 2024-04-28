import { TransactionType } from "../../../../../../../../types/Contracts/ContractTransactionAttachment";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { DialogContent, LinearProgress } from "@mui/material";
import AttachmentRow from "./AttachmentRow";
import InputFileUpload from "../../../../../../../../components/UploadFilesButton";
import { useContext, useState } from "react";
import axios from "axios";
import { Api } from "../../../../../../../../constants";
import { serialize } from "object-to-formdata";
import { CreateProcessingReplyContext } from "../CreateProcessingReplyContext";

function SaveAttachementsForm({}: PropsType) {
  const [progress, setProgress] = useState<number | undefined>(undefined);

  const { comment, refreshComment } = useContext(CreateProcessingReplyContext);
  if (!comment) {
    console.log("no processing to render");
    return <></>;
  }
  const onUpload = (files: FileList) => {
    if (files.length === 0) return;
    axios
      .post(
        Api(
          `employee/contract/items/comment-processing/store-attachment-type-images/${comment.id}`
        ),
        serialize({ images: files }, { indices: true }),
        {
          onUploadProgress(data) {
            //Set the progress value to show the progress bar
            if (data.total)
              setProgress(Math.round((100 * data.loaded) / data.total));
          },
        }
      )
      .then(() => {
        refreshComment(comment.id);
      })
      .finally(() => {
        setProgress(undefined);
      });
  };

  console.log("comment inside", comment);

  return (
    <>
      <DialogContent>
        <InputFileUpload
          onChange={(e) => {
            if (e.target.files) onUpload(e.target.files);
          }}
          buttonProps={{ sx: { mb: 2 } }}
        />
        {typeof progress === "number" && (
          <LinearProgress variant="determinate" color="info" value={progress} />
        )}
        <TableContainer>
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell>نوع المرفق</TableCell>
                <TableCell>المرفق</TableCell>
                <TableCell>الوصف</TableCell>
                <TableCell sx={{ textAlign: "center" }}>اجراء</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comment.attachment?.map((attachment) => (
                <AttachmentRow attachment={attachment} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </>
  );
}

type PropsType = {};

export default SaveAttachementsForm;
