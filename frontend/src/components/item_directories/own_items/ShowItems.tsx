import reactRouterDom, { useHistory } from "react-router-dom";
import React from "react";
import {
  Theme,
  makeStyles,
  Typography,
  Grid,
  Card,
  Tooltip,
  IconButton,
  CardContent,
} from "@material-ui/core";
import {
  getSpecificTemplate,
  SpecificTemplate,
  deleteTemplate,
} from "../../../services/template";
import Page from "../../helpers/Page";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ConfirmDialog from "../../helpers/ConfirmDialog";
const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  root: {
    height: "100%",
  },
  title: { textAlign: "center", display: "block" },
  desc: { textAlign: "center" },
  content: {
    width: "100%",
  },
  button: {
    marginBottom: theme.spacing(2),
  },
  img: {
    maxHeight: 400,
    width: "100%",
  },
}));
export default ({ match }: { match: reactRouterDom.match }) => {
  const classes = useStyles();
  const history = useHistory();
  const [template, setTemplate] = React.useState<SpecificTemplate>({
    title: "Loading...",
    info: "Loading...",
    templateImageUrl: null,
    createdOn: "",
    lastUpdated: "",
    items: [],
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const deleteTemplateAction = () => {
    deleteTemplate((match.params as { id: string | number }).id).then(() =>
      history.push("/myitems")
    );
  };
  React.useEffect(() => {
    const id = (match.params as { id: string }).id;
    getSpecificTemplate(id).then(({ data }) => {
      setTemplate(data);
    });
  }, [match.params]);
  return (
    <Page
      maxWidth={false}
      paperStyles={(theme: Theme) => ({
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
      })}
      containerStyles={(_) => ({
        display: "grid",
      })}
    >
      <Grid container spacing={2} justify="flex-start" alignItems="flex-end">
        <Grid item xs={12}>
          <Typography component="h1" variant="h4">
            {template.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography component="p" variant="body1">
            <b>Description: </b>
            {template.info}
          </Typography>
          <Typography component="p" variant="body1">
            <b>Created On:</b> {new Date(template.createdOn).toString()}
          </Typography>
          <Typography component="p" variant="body1">
            <b>Last Updated:</b> {new Date(template.lastUpdated).toString()}
          </Typography>
          <Tooltip title="Rank the items">
            <IconButton aria-label="rank the items">
              <PlayArrowIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete this template">
            <IconButton
              aria-label="delete template"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit this template">
            <IconButton aria-label="edit template">
              <EditIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Grid>

        {template &&
          template.items.map(({ id, itemImageUrl, name }) => (
            <Grid item xs={5} sm={4} md={3} lg={2} key={id}>
              <Card variant="elevation" elevation={5} className={classes.root}>
                <CardContent>
                  <Typography component="h4" variant="body1">
                    {name}
                  </Typography>
                </CardContent>
                {itemImageUrl && (
                  <img
                    src={itemImageUrl as string}
                    alt={name}
                    className={classes.img}
                  />
                )}
              </Card>
            </Grid>
          ))}
      </Grid>
      <ConfirmDialog
        title="Delete this template"
        desc="This action is irreversible"
        acceptButtonDesc="OK"
        rejectButtonDesc="Go back"
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        onAccept={deleteTemplateAction}
      />
    </Page>
  );
};
