import React from "react";
import {
  Theme,
  createStyles,
  makeStyles,
  Container,
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
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
  })
);
export default () => {
  const classes = useStyles();
  const [templateName, setTemplateName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [templateImage, setTemplateImage] = React.useState<File | null>(null);
  const [items, setItems] = React.useState<
    {
      name: string;
      file?: File;
    }[]
  >([]);
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
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
                label="Title"
                onChange={(e) => setTemplateName(e.target.value)}
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
                label={`Description (${
                  300 - desc.length
                } characters remaining)`}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Next Step
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <PopUp severity="error" message={message} setMessage={setMessage} />
    </Container>
  );
};
