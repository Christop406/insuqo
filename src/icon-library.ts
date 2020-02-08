import * as fontawesome from '@fortawesome/fontawesome-svg-core';

import { faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';

fontawesome.library.add(
    // Regular icons
    faCheckCircle,
    faTimesCircle,

    // Solid icons
    faExclamationCircle
);
