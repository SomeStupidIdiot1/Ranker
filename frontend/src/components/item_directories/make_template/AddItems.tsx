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
import { useHistory } from "react-router-dom";
import { addItem } from "../../../services/template";
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
export default ({ title }: { title: string }) => {
  const history = useHistory();
  const classes = useStyles();
  const [itemName, setItemName] = React.useState("");
  const [image, setImage] = React.useState<File | null>(null);
  const [message, setMessage] = React.useState("");
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!itemName) {
      setMessage("Item name cannot be empty");
      return;
    }
    addItem({
      itemName,
      titleOfTemplate: title,
      imgStringBase64:
        // @ts-ignore
        image
          ? `data:${
              // @ts-ignore
              image.fileType
              // @ts-ignore
            };base64,${image.getFileEncodeBase64String()}`
          : "",
    })
      .then(() => {
        setItemName("");
        setImage(null);
        setMessage("Successfully added the item&severity=success");
      })
      .catch((err) => {
        if (err.response) {
          const status = err.response.status;
          setMessage(`Error code ${status}.`);
        }
      });
  };
  return (
    <>
      <Typography component="h1" variant="h5">
        Add Items
      </Typography>
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <Grid container spacing={1} justify="center">
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Item Name"
              onChange={(e) => setItemName(e.target.value)}
              value={itemName}
              autoFocus
              color="secondary"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography component="p" variant="subtitle1">
              Upload Item Image (Optional)
            </Typography>
            <FilePond
              files={image ? [image] : []}
              // @ts-ignore
              imagePreviewHeight={300}
              imagePreviewMaxFileSize="2MB"
              imageResizeMode="cover"
              acceptedFileTypes={["image/*"]}
              allowMultiple={false}
              getFileEncodeBase64String
              onupdatefiles={(fileItems) => {
                if (fileItems.length) setImage(fileItems[0]);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Add Item
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => {
                history.push("/myitems");
                window.location.reload();
              }}
            >
              Finish
            </Button>
          </Grid>
        </Grid>
      </form>
      <PopUp severity="error" message={message} setMessage={setMessage} />
    </>
  );
};
