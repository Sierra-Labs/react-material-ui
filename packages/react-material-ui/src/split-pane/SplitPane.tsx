import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
  RefObject
} from 'react';
import styled from 'styled-components';

const StyledSplitPane = styled.div`
  display: flex;
  overflow: hidden;
  flex: 1;
  &.vertical {
    flex-direction: column;
  }
`;

export interface SplitDragState {
  element: HTMLElement | null;
  position: number;
}

export interface SplitPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: RefObject<HTMLDivElement>;
  primary?: 'next' | 'previous';
  direction?: 'horizontal' | 'vertical';
  width?: number;
}

const SplitPane: React.FC<SplitPaneProps> = ({
  ref,
  primary = 'previous',
  direction = 'horizontal',
  children,
  className,
  width,
  ...props
}) => {
  const [dragState, setDragState] = useState<SplitDragState>();
  const isPrevious: boolean = primary === 'previous';

  const handleStartDrag = useCallback(
    (element: HTMLElement, x: number, y: number) => {
      if (element.parentElement) {
        // disable pointer events on panes being resized (prevents iframes taking
        // over mouse events)
        toggleChildPointerEvents(element.parentElement);
      }
      setDragState({
        position: direction === 'horizontal' ? x : y,
        element: (isPrevious
          ? element.previousSibling
          : element.nextSibling) as HTMLElement
      });
    },
    [direction, isPrevious]
  );

  const handleDrag = useCallback(
    (x: number, y: number) => {
      if (!dragState?.element) {
        return;
      }

      const multiplier: number = isPrevious ? 1 : -1;
      const position: number = direction === 'horizontal' ? x : y;
      const styleSize = direction === 'horizontal' ? 'width' : 'height';
      const rect = dragState.element.getBoundingClientRect();
      const diff: number = (position - dragState.position) * multiplier;
      const size: number = rect[styleSize] + diff;

      dragState.element.style[styleSize] = `${size}px`;
      dragState.element.style.flex = '0 0 auto';
      setDragState({ element: dragState.element, position });
    },
    [direction, dragState, isPrevious]
  );

  const pauseEvent = (event: Event) => {
    // prevent text selection while dragging
    event.stopPropagation?.();
    event.preventDefault?.();
    event.cancelBubble = true;
    event.returnValue = false;
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      pauseEvent(event);
      handleDrag(event.clientX, event.clientY);
    },
    [handleDrag]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      pauseEvent(event);
      handleDrag(event.touches[0].clientX, event.touches[0].clientY);
    },
    [handleDrag]
  );

  const handleMouseUp = useCallback(() => {
    if (dragState?.element?.parentElement) {
      toggleChildPointerEvents(dragState.element.parentElement);
    }
    setDragState(undefined);
  }, [dragState]);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  // remove null children
  const childComponents = React.Children.toArray(children).filter(c => c);
  return (
    <StyledSplitPane
      ref={ref}
      className={`split-pane ${direction} ${className}`}
      {...props}
      style={width ? { flex: `0 0 auto`, width: `${width}px` } : {}}
    >
      {childComponents.map((child, index) => (
        <Fragment key={index}>
          {child}
          {index < childComponents.length - 1 && (
            <SplitResizer
              direction={direction}
              onMouseDown={event => {
                handleStartDrag(
                  event.target as HTMLElement,
                  event.clientX,
                  event.clientY
                );
              }}
              onTouchStart={event => {
                handleStartDrag(
                  event.target as HTMLElement,
                  event.touches[0].clientX,
                  event.touches[0].clientY
                );
              }}
            />
          )}
        </Fragment>
      ))}
    </StyledSplitPane>
  );
};

const StyledPane = styled.div`
  flex: 1;
  &.flex {
  }
`;

export interface PaneProps extends React.HTMLAttributes<HTMLDivElement> {
  flex?: boolean;
  width?: number;
}

export const Pane: React.FC<PaneProps> = ({
  children,
  flex,
  width,
  className,
  ...props
}) => {
  return (
    <StyledPane
      className={`${flex && 'flex'} ${className || ''}`}
      style={{ width }}
      {...props}
    >
      {children}
    </StyledPane>
  );
};

const borderStyle: string = '5px solid rgba(255, 255, 255, 0)';
const borderHoverStyle: string = '5px solid rgba(255, 255, 255, 0.15)';

const StyledSplitResizer = styled.div`
  position: relative;
  background: #555;
  box-sizing: border-box;
  background-clip: padding-box !important;
  transition: border 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);

  &.horizontal {
    width: 11px;
    margin: 0 -5px;
    cursor: col-resize;
    border-left: ${borderStyle};
    border-right: ${borderStyle};
    &:hover {
      border-left: ${borderHoverStyle};
      border-right: ${borderHoverStyle};
    }
  }

  &.vertical {
    height: 11px;
    margin: -5px 0;
    cursor: row-resize;
    border-top: ${borderStyle};
    border-bottom: ${borderStyle};
    &:hover {
      border-top: ${borderHoverStyle};
      border-bottom: ${borderHoverStyle};
    }
  }
`;

export interface SplitResizerProps {
  direction?: 'horizontal' | 'vertical';
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onTouchStart?: (event: React.TouchEvent<HTMLDivElement>) => void;
}

export const SplitResizer: React.FC<SplitResizerProps> = ({
  direction,
  onMouseDown,
  onTouchStart
}) => {
  return (
    <StyledSplitResizer
      className={`resizer ${direction}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    />
  );
};

export default SplitPane;

// Helper functions

function toggleChildPointerEvents(element: HTMLElement) {
  Array.from(element.children).forEach(e => {
    const element = e as HTMLElement;
    if (!element.className.includes('resizer')) {
      if (element.style.pointerEvents === 'none') {
        element.style.pointerEvents = 'auto';
      } else {
        element.style.pointerEvents = 'none';
      }
    }
  });
}
