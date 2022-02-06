import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Icon,
  Divider,
} from '@mui/material';

function Instructions(props) {
  const displayInstructions = (data) => {
    const last = data.legs.at(-1).steps.at(-1);

    return (
      <List>
        {data.legs.map((leg) => {
          return leg.steps.slice(0, -1).map((step) => (
            <ListItem>
              <ListItemIcon>{displayIcon(step.maneuver)}</ListItemIcon>
              <ListItemText
                primary={step.maneuver.instruction}
                secondary={props.handleDistance(step.distance)}
              />
            </ListItem>
          ));
        })}
        <ListItem>
          <ListItemIcon>{displayIcon(last.maneuver)}</ListItemIcon>
          <ListItemText
            primary={last.maneuver.instruction}
            secondary={props.handleDistance(last.distance)}
          />
        </ListItem>
      </List>
    );
  };

  const displayIcon = (maneuver) => {
    const src_img =
      '/directions-icons/' +
      maneuver.type.replaceAll(' ', '_') +
      (maneuver.modifier !== undefined
        ? '_' + maneuver.modifier.replaceAll(' ', '_')
        : '') +
      '.svg';

    return (
      <Icon>
        <img src={process.env.PUBLIC_URL + src_img} />
      </Icon>
    );
  };

  return <Paper id={props.id}>{displayInstructions(props.data)}</Paper>;
}

export default Instructions;
