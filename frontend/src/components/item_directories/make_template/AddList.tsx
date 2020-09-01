import React from "react";
import {
  Theme,
  makeStyles,
  Typography,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import PopUp from "../../helpers/PopUp";
import { FilePond, registerPlugin, File } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
// @ts-ignore
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import { addTemplate } from "../../../services/template";
import AddItems from "./AddItems";
import Page from "../../helpers/Page";
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);
const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));
export default () => {
  const classes = useStyles();
  const [templateName, setTemplateName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [templateImage, setTemplateImage] = React.useState<File | null>(null);
  const [id, setId] = React.useState<number | string>("");
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!templateName) {
      setMessage("Template name cannot be empty");
      return;
    }
    addTemplate({
      title: templateName,
      info: desc,
      imgStringBase64:
        // @ts-ignore
        templateImage
          ? `data:${
              // @ts-ignore
              templateImage.fileType
              // @ts-ignore
            };base64,${templateImage.getFileEncodeBase64String()}`
          : "",
    })
      .then(({ data }) => {
        setId(data.id);
        setTemplateName("");
        setDesc("");
        setTemplateImage(null);
      })
      .catch((err) => {
        if (err.response) {
          const status = err.response.status;
          if (status === 401) {
            setMessage("You need to be logged in to make a template");
          } else
            setMessage(
              `Error code ${status}. Do you have a template with the same title?`
            );
        }
      });
  };
  if (id) return <AddItems id={id} returnUrl={`/myitems/${id}`} />;
  return (
    <Page maxWidth="xs">
      <Typography component="h1" variant="h5">
        Create a Template
      </Typography>
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <Grid container spacing={1} justify="center">
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label={`Title (${50 - templateName.length} characters remaining)`}
              onChange={(e) => setTemplateName(e.target.value.substring(0, 50))}
              value={templateName}
              autoFocus
              color="secondary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              value={desc}
              label={`Description (${300 - desc.length} characters remaining)`}
              placeholder="300 characters max"
              onChange={(e) => setDesc(e.target.value.substring(0, 300))}
              color="secondary"
              rows={7}
              rowsMax={10}
              multiline
            />
          </Grid>
          <Grid item xs={12}>
            <Typography component="p" variant="subtitle1">
              Upload Template Image (Optional)
            </Typography>
            <FilePond
              files={templateImage ? [templateImage] : []}
              // @ts-ignore
              imagePreviewHeight={300}
              imagePreviewMaxFileSize="2MB"
              imageResizeMode="cover"
              acceptedFileTypes={["image/*"]}
              allowMultiple={false}
              getFileEncodeBase64String
              onupdatefiles={(fileItems) => {
                if (fileItems.length) setTemplateImage(fileItems[0]);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Next Step
            </Button>
          </Grid>
        </Grid>
      </form>
      <PopUp severity="error" message={message} setMessage={setMessage} />
    </Page>
  );
};
