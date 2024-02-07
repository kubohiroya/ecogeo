import { useEffect } from 'react';
import { getCurrentDatabaseTableType } from 'src/app/services/database/GeoDatabaseTable';
import { DOCUMENT_TITLE } from 'src/app/Constants';

export function useDocumentTitle() {
  useEffect(() => {
    const tableTypeName = getCurrentDatabaseTableType()
      ? 'Projects'
      : 'Resources';
    document.title = DOCUMENT_TITLE + ` - ` + tableTypeName;
  }, []);
}
