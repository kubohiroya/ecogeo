import { useEffect } from 'react';
import { getCurrentDatabaseTableType } from '~/app/services/database/GeoDatabaseTable';
import { DOCUMENT_TITLE } from '~/app/Constants';

export function useDocumentTitle() {
  useEffect(() => {
    const tableTypeName = getCurrentDatabaseTableType()
      ? 'Projects'
      : 'Resources';
    document.title = DOCUMENT_TITLE + ` - ` + tableTypeName;
  }, []);
}
