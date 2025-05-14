export const featureData = [
  {
    icon: 'icon_claw_arm.svg',
    title: 'Claw Arm',
    details:
      'Is engineered for full rotation and collects objects from all directions.',
    style: {
      left: '30%',
      top: 272.5,
      transform: 'translateX(-50%)',
      maxWidth: 261,
    },
  },
  {
    icon: 'icon_camera.svg',
    title: 'Camera',
    details: `Streams live video, takes pictures and provides 
real-time feedback on what you're collecting.`,
    style: {
      right: '30%',
      top: 272.5,
      transform: { xs: 'translateX(80%)', xl: 'translateX(50%)' },
      maxWidth: { xs: 290, lg: 340 },
    },
  },
  {
    icon: 'icon_object_pickup.svg',
    title: 'Object-pickup',
    details: `With real-time sensor gripping, handles rounded objects with ease.`,
    style: {
      left: '24%',
      transform: { xs: 'translateX(-90%)', xl: 'translateX(-50%)' },
      top: 499.5,
      maxWidth: 262,
    },
  },
  {
    icon: 'icon_headlights.svg',
    title: 'Head Lights',
    details: `At the front, back, and on the claw arm 
light up the terrain and claw area.`,
    style: {
      right: '24%',
      transform: { xs: 'translateX(90%)', xl: 'translateX(50%)' },
      top: 499.5,
      maxWidth: 283,
    },
  },
  {
    icon: 'icon_terrain_wheels.svg',
    title: 'All-terrain wheels',
    details: `With directional rotation, tank turning, and rugged, offer speed, balance, and traction.`,
    style: {
      left: '50%',
      transform: 'translateX(-50%)',
      top: 819,
      maxWidth: 340,
    },
  },
];
