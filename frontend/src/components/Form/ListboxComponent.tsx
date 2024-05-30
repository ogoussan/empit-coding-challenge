import {cloneElement, ComponentType, forwardRef, HTMLAttributes, ReactElement, useRef} from "react";
import {Virtuoso} from "react-virtuoso";

export const ListboxComponent = forwardRef<HTMLUListElement>(({ children, ...rest }, ref) => {
  const data = children as ReactElement[];
  const localRef = useRef<string>('200px');

  return (
    <ul
      ref={reference => {
        const maxHeight = reference ? getComputedStyle(reference).maxHeight : null;
        if (maxHeight && maxHeight !== localRef.current) {
          localRef.current = maxHeight;
        }

        if (typeof ref === 'function') {
          ref(reference);
        }
      }}
      {...rest}
    >
      <Virtuoso
        style={{ height: localRef.current }}
        data={data}
        itemContent={(index, child) => {
          return cloneElement(child, { index });
        }}
      />
    </ul>
  );
}) as ComponentType<HTMLAttributes<HTMLElement>>;