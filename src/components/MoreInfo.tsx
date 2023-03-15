import {
  forwardRef,
  PlacementWithLogical,
  ResponsiveValue,
  Tooltip,
} from '@chakra-ui/react';

const MoreInfo = forwardRef(({ children, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
  >
    {children}
  </div>
));

export const MoreInfoTooltip = ({
  children,
  toolTipLabel,
  toolTipHasArrow,
  placement,
}: {
  children: React.ReactNode;
  toolTipLabel: string;
  toolTipHasArrow: boolean;
  placement?: PlacementWithLogical;
}) => {
  return (
    <Tooltip
      placement={placement || 'bottom'}
      hasArrow={toolTipHasArrow}
      label={toolTipLabel}
    >
      <MoreInfo>{children}</MoreInfo>
    </Tooltip>
  );
};
